export class Course {
	readonly courseName: string;
	readonly fee: string;
	readonly eligibility: string;
	readonly duration: string;
}

export class CourseDataDto {
	readonly _id: string;
	readonly collegeId: string;
	readonly courses: Course[]
}

export class CourseResponseDto {
	status: boolean;
	data: CourseDataDto;
	message: string;
}

export class CourseResponseArrayDto {
	status: boolean;
	data: CourseDataDto[];
	message: string;
}
