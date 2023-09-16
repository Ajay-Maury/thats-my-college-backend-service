export class CollegeResponseData {
  readonly _id: string;
  readonly name: string;
  readonly address: string;
  readonly contact: string[];
  readonly city: string;
  readonly state: string;
  readonly collegeType: string[];
  readonly established: number;
  readonly university: string;
  readonly logo: string;
  readonly image: string[];
  readonly message: string;
  readonly details: string;
  readonly rating: number;
  readonly featured: boolean;
}

export class CollegeSingleResponseDto {
  readonly status: boolean;
  data: CollegeResponseData;
  message: string;
}

export class CollegeResponseDto {
  readonly status: boolean;
  data: CollegeResponseData[];
  message: string;
}
