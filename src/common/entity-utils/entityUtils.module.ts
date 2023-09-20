import { Module, Global } from '@nestjs/common';
import { EntityUtilsService } from './entityUtils.service';

@Global() // Use the Global decorator to make this module available globally
@Module({
  providers: [EntityUtilsService],
  exports: [EntityUtilsService], // Export the EntityUtilsService provider so it can be used in other modules
})
export class EntityUtilsModule {}
