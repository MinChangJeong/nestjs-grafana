import { Controller, Post, Body, Get } from '@nestjs/common';
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

  @Get()
  async findAll(): Promise<Board[]> {
    return this.boardService.findAll();
  }
}
