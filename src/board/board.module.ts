import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Board } from './board.entity';
import { BoardService } from './board.service';
import { BoardController } from './board.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]) // Board 엔티티 등록
  ],
  controllers: [BoardController],
  providers: [BoardService],
})
export class BoardModule {}
