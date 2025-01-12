import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Board } from './board.entity';
import { CreateBoardDto } from './create-board.dto';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class BoardService {
  private readonly logger = new Logger(BoardService.name);

  constructor(
    @InjectRepository(Board)
    private readonly boardRepository: Repository<Board>,
  ) {}

  @Transactional()
  async createBoard(createBoardDto: CreateBoardDto): Promise<Board> {
    const { title, content } = createBoardDto;
    
    // 새로운 Board 엔티티 인스턴스 생성
    const board = this.boardRepository.create({
      title,
      content,
    });
    
    throw new Error("error occured");

    await this.boardRepository.save(board);

    return board;
  }
}
