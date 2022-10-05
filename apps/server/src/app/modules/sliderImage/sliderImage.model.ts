import { ApiProperty } from '@nestjs/swagger'
import { SliderImage } from '@prisma/client'

export class SliderImageEntity implements SliderImage {
  @ApiProperty()
  id: number

  @ApiProperty()
  name: string

  @ApiProperty()
  path: string
}

export class SliderImageCreateReqBody {
  @ApiProperty()
  name: string

  @ApiProperty()
  path: string
}

export class SliderImageEditReqBody {
  @ApiProperty()
  name: string

  @ApiProperty()
  path: string
}

export interface SliderImageListResponse {
  data: SliderImageEntity[]
  info: {
    count: number
  }
}

export class SliderImageDeletedResponse {
  @ApiProperty()
  message: 'Silindi.' | 'Bir hata oluştu.'
}