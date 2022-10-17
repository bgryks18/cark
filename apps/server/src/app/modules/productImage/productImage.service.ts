import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { PrismaService } from '../../globals/prisma.service'
import { ProductImageCreateInput, ProductImageWhereInput } from './productImage.dto'
import {
  ProductImageDeletedResponse,
  ProductImageEditReqBody,
  ProductImageEntity,
  ProductImageListResponse,
} from './productImage.model'
import { Locals } from '../../middlewares/getList.middleware'
import { ErrorHandler } from '../../utils/errorHandler'
import { Request } from 'express'
import * as fs from 'fs'
@Injectable()
export class ProductImageService {
  constructor(private prisma: PrismaService) {}

  async create(productImage: any, req: Request): Promise<ProductImageEntity> {
    try {
      const { path } = productImage
      const { name, productId } = req.body

      return await this.prisma.productImage.create({
        data: {
          name,
          path,
          product: {
            connect: {
              id: Number(productId),
            },
          },
        },
        include: {
          product: {
            include: {
              category: true,
              slider: {
                include: {
                  images: {
                    select: {
                      id: true,
                      name: true,
                      path: true,
                    },
                  },
                  _count: true,
                },
              },
            },
          },
        },
      })
    } catch (e) {
      new ErrorHandler(e)
    }
  }

  async list(where: ProductImageWhereInput, locals: Locals): Promise<ProductImageListResponse> {
    try {
      const res = await this.prisma.productImage.findMany({
        where: omit(where, ['offset', 'limit', 'sort', 'sortby']),
        orderBy: { [locals.sortby]: locals.sort },
        skip: locals.offset,
        take: locals.limit,
        include: {
          product: {
            include: {
              category: true,
              slider: {
                include: {
                  images: {
                    select: {
                      id: true,
                      name: true,
                      path: true,
                    },
                  },
                  _count: true,
                },
              },
            },
          },
        },
      })
      return {
        data: res,
        info: {
          count: await this.prisma.productImage.count({
            where: omit(where, ['offset', 'limit', 'sort', 'sortby']),
            skip: locals.offset,
            take: locals.limit,
          }),
        },
      }
    } catch (e) {
      new ErrorHandler(e)
    }
  }

  async detail(id: number): Promise<ProductImageEntity> {
    try {
      return await this.prisma.productImage.findFirstOrThrow({
        where: { id },
        include: {
          product: {
            include: {
              category: true,
              slider: {
                include: {
                  images: {
                    select: {
                      id: true,
                      name: true,
                      path: true,
                    },
                  },
                  _count: true,
                },
              },
            },
          },
        },
      })
    } catch (e) {
      new ErrorHandler(e)
    }
  }

  async edit(productImage: any, req: Request): Promise<ProductImageEntity> {
    try {
      const { path } = productImage
      const { name, productId } = req.body
      const { id } = req.params

      return await this.prisma.productImage.update({
        where: {
          id: Number(id),
        },
        data: {
          name,
          path,
          product: {
            connect: {
              id: Number(productId),
            },
          },
        },
        include: {
          product: {
            include: {
              category: true,
              slider: {
                include: {
                  images: {
                    select: {
                      id: true,
                      name: true,
                      path: true,
                    },
                  },
                  _count: true,
                },
              },
            },
          },
        },
      })
    } catch (e) {
      new ErrorHandler(e)
    }
  }

  async delete(id: number): Promise<ProductImageDeletedResponse> {
    try {
      const foundItem = await this.prisma.productImage.findFirstOrThrow({
        where: {
          id,
        },
      })
      fs.unlinkSync('./' + foundItem.path)
      await this.prisma.productImage.delete({
        where: {
          id,
        },
      })
      return { message: 'Silindi.' }
    } catch (e) {
      new ErrorHandler(e)
    }
  }

  async deleteMany(idList: number[]): Promise<ProductImageDeletedResponse> {
    try {
      await this.prisma.productImage.deleteMany({
        where: {
          id: {
            in: idList,
          },
        },
      })
      return { message: 'Silindi.' }
    } catch (e) {
      new ErrorHandler(e)
    }
  }
}
