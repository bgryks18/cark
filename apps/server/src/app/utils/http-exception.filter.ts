import { ExceptionFilter, Catch, ArgumentsHost, HttpException } from '@nestjs/common'
import { Request, Response } from 'express'
@Catch(Error)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    console.log('filter worked')
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()
    let status = exception.getStatus()

    if (exception?.cause?.name === 'NotFoundError') {
      status = 404
    }
    response.status(status).json({
      timestamp: new Date().toISOString(),
      path: request.url,
      ...exception,
      status,
    })
  }
}
