import { Controller, Post, Body } from '@nestjs/common';
import { BoardService } from './board.service';
import { CreateBoardDto } from './create-board.dto';
import { Board } from './board.entity';

@Controller('board')
export class BoardController {
  constructor(private readonly boardService: BoardService) {}

  @Post()
  async createBoard(@Body() createBoardDto: CreateBoardDto): Promise<Board> {
    return this.boardService.createBoard(createBoardDto);
  }
}
