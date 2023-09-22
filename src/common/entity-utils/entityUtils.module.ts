import { Module, Global } from '@nestjs/common';
import { EntityUtilsService } from './entityUtils.service';
import { AuthModule } from 'src/modules/auth/auth.module';

@Global() // Use the Global decorator to make this module available globally
@Module({
  imports: [AuthModule], // Import the AuthModule to access authentication services
  providers: [EntityUtilsService], // Define EntityUtilsService as a provider within this module
  exports: [EntityUtilsService], // Export the EntityUtilsService provider so it can be used in other modules
})
export class EntityUtilsModule {}
