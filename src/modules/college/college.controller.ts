import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpStatus,
  Res,
} from '@nestjs/common';
import { CollegeService } from './college.service';
import { CreateCollegeDto } from './dto/create-college.dto';
import { UpdateCollegeDto } from './dto/update-college.dto';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CollegeResponseDto,
  CollegeSingleResponseDto,
} from './dto/college-response.dto';

@Controller('college')
@ApiTags('college')
export class CollegeController {
  constructor(private readonly collegeService: CollegeService) {}

  @Post()
  @ApiResponse({ status: HttpStatus.CREATED, type: CollegeResponseDto })
  @ApiOperation({ summary: 'Create college' })
  public async createNewCollege(
    @Res() res,
    @Body() createCollegeDto: CreateCollegeDto,
  ): Promise<CollegeResponseDto> {
    try {
      const colleges = await this.collegeService.createCollege(
        createCollegeDto,
      );
      return res.status(HttpStatus.OK).json({
        status: true,
        data: colleges,
        message: `Successfully created college`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: [], message: error.message });
    }
  }

  @Get()
  @ApiOperation({ summary: 'Get all colleges' })
  @ApiResponse({ status: HttpStatus.OK, type: CollegeResponseDto })
  public async getAllCollege(@Res() res): Promise<CollegeResponseDto> {
    try {
      const colleges = await this.collegeService.findAllCollege();
      return res.status(HttpStatus.OK).json({
        status: true,
        data: colleges,
        message: `Successfully fetched all colleges`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: [], message: error.message });
    }
  }

  @Get(':collegeId')
  @ApiOperation({ summary: 'Get college by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async getOneCollege(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.findOneCollege(collegeId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully fetched college with id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Patch(':collegeId')
  @ApiOperation({ summary: 'Update college by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async updateOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
    @Body() updateCollegeDto: UpdateCollegeDto,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.updateCollegeById(
        collegeId,
        updateCollegeDto,
      );
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully updated college with id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }

  @Delete(':collegeId')
  @ApiOperation({ summary: 'Delete college and courses by college id' })
  @ApiResponse({ status: HttpStatus.OK, type: CollegeSingleResponseDto })
  public async deleteOneById(
    @Res() res,
    @Param('collegeId') collegeId: string,
  ): Promise<CollegeSingleResponseDto> {
    try {
      const college = await this.collegeService.removeCollegeById(collegeId);
      return res.status(HttpStatus.OK).json({
        status: true,
        data: college,
        message: `Successfully deleted college and courses with college id #${collegeId}`,
      });
    } catch (error) {
      return res
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .json({ status: false, data: {}, message: error.message });
    }
  }
}
