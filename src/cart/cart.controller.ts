import { Controller, Get, Delete, Put, Body, Req, Post, HttpStatus } from '@nestjs/common';
import { OrderService } from '../order';
import { AppRequest, getUserIdFromRequest } from '../shared';
import { lookup } from '../db/client';
import { calculateCartTotal } from './models-rules';
import { CartService } from './services';

@Controller('api/profile/cart')
export class CartController {
  constructor(
    private cartService: CartService,
    private orderService: OrderService
  ) { }

  @Get()
  async findUserCart(@Req() req: AppRequest) {
    const userId = req.query.userId;
    let cart;
    let cartItems;


    if (userId) {
      cart = await lookup(`SELECT * FROM carts where user_id = '${userId}'`);
      for (const item of cart.rows) {
        cartItems = await lookup(`SELECT * FROM cart_items where cart_id = '${item.id}'`);
        if (cartItems.rows.length) {
          break ;
        }
      }

      return {
        statusCode: HttpStatus.OK,
        message: 'Active cart for selected user',
        data: { cart: cart.rows.filter(row => row.status !== 'ORDERED'), cart_items: cartItems.rows },
      }
    }

    cart = await lookup(`SELECT * FROM carts`);
    cartItems = await lookup(`SELECT * FROM cart_items`);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { cart: cart.rows, cart_items: cartItems.rows },
    }
  }

  @Put()
  updateUserCart(@Req() req: AppRequest, @Body() body) {
    const cart = this.cartService.updateByUserId(getUserIdFromRequest(req), body)

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: {
        cart,
        total: calculateCartTotal(cart),
      }
    }
  }

  @Delete()
  clearUserCart(@Req() req: AppRequest) {
    this.cartService.removeByUserId(getUserIdFromRequest(req));

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
    }
  }

  @Post('checkout')
  checkout(@Req() req: AppRequest, @Body() body) {
    const userId = getUserIdFromRequest(req);
    const cart = this.cartService.findByUserId(userId);

    if (!(cart && cart.items.length)) {
      const statusCode = HttpStatus.BAD_REQUEST;
      req.statusCode = statusCode

      return {
        statusCode,
        message: 'Cart is empty',
      }
    }

    const { id: cartId, items } = cart;
    const total = calculateCartTotal(cart);
    const order = this.orderService.create({
      ...body,
      userId,
      cartId,
      items,
      total,
    });
    this.cartService.removeByUserId(userId);

    return {
      statusCode: HttpStatus.OK,
      message: 'OK',
      data: { order }
    }
  }
}
