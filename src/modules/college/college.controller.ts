import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, Res } from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { CollegeResponseDto, CollegeSingleResponseDto } from './dto/response-college.dto';

@Controller('college')
@ApiTags('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) { }

  @Post()
  @ApiResponse({ status: HttpStatus.OK, type: CollegeResponseDto })
  public async createNewCollege(@Res() res, @Body() createCollegeDto: CreateCollegeDto): Promise<CollegeResponseDto> {
    try {
      const colleges = await this.collegeService.createCollege(createCollegeDto)
      return res.status(HttpStatus.OK).json({ status: true, data: colleges, message: `Successfully created college` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: [], message: error.message });
    }
  }

  @Get()
  @ApiResponse({ status: HttpStatus.OK, type: CollegeResponseDto })
  public async getAllCollege(@Res() res): Promise<CollegeResponseDto> {
    try {
      const colleges = await this.collegeService.findAllCollege()
      return res.status(HttpStatus.OK).json({ status: true, data: colleges, message: `Successfully fetched all colleges` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: [], message: error.message });
    }
  }

  @Get(':id')
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async getOneCollege(@Res() res, @Param("id") id: string): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.findOneCollege(id)
      return res.status(HttpStatus.OK).json({ status: true, data: college, message: `Successfully fetched college with id #${id}` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message });
    }
  }

  @Patch(':id')
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async updateOneById(@Res() res, @Param('id') id: string, @Body() updateCollegeDto: UpdateCollegeDto): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.updateCollegeById(id, updateCollegeDto)
      return res.status(HttpStatus.OK).json({ status: true, data: college, message: `Successfully updated college with id #${id}` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message });
    }
  }

  @Delete(':id')
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async deleteOneById(@Res() res, @Param('id') id: string): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.removeCollegeById(id)
      return res.status(HttpStatus.OK).json({ status: true, data: college, message: `Successfully deleted college with id #${id}` });
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ status: false, data: {}, message: error.message });
    }
  }
}
