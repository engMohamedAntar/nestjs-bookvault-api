//bookmark.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from 'src/dto/create-bookmark-dto';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;
  const createBookmarkDto: CreateBookmarkDto = {
    title: 'bookMark',
    description: 'bookMark desc',
    link: 'http://bookmark/1',
  };

  const mockPrismaService = {
    bookmark: {
      create: jest.fn(({ data }) => Promise.resolve({ id: 10, ...data })),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        }, // instead of using real PrismaServic used an empty obj (We can put PrismaService directly)
      ],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  it('bookmarkService should be defined', () => {
    expect(bookmarkService).toBeDefined();
  });
  it('PrismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('createBookmark', () => {
    it("Should call 'create' method in BookMark repo", async () => {
      await bookmarkService.createBookmark(1, createBookmarkDto);
      expect(prismaService.bookmark.create).toHaveBeenCalled();
      expect(prismaService.bookmark.create).toHaveBeenCalledTimes(1);
    });

    it('Should creat a new bookMark', async () => {
      const result = await bookmarkService.createBookmark(2, createBookmarkDto);
      expect(result).toBeDefined();
      expect(result.id).toBe(10);
      expect(result.title).toBe('bookMark');
    });
  });
});
