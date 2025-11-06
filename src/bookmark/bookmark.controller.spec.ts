import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkController } from './bookmark.controller';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from '../dto/create-bookmark-dto';
import { NotFoundException } from '@nestjs/common';

describe('bookmarkController', () => {
  let bookmarkController: BookmarkController;
  let bookmarkService: BookmarkService;
  const bookmarkDto: CreateBookmarkDto = {
    title: 'book 1',
    description: 'book 1 description',
    link: 'https://book/read',
  };
  const bookmarksArr = [
    { id: 1, title: 'book 1', userId: 1 },
    { id: 2, title: 'book 2', userId: 2 },
    { id: 3, title: 'book 3', userId: 3 },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookmarkController],
      providers: [
        {
          provide: BookmarkService,
          useValue: {
            createBookmark: jest.fn((userId: number, dto: CreateBookmarkDto) =>
              Promise.resolve({ ...dto, id: userId }),
            ),
            getAllBookmarks: jest.fn((userId: number, query: any) =>
              Promise.resolve(bookmarksArr),
            ),
            getOneBookmark: jest.fn((userId: number, bookmarkId: number) => {
              const bookmark = bookmarksArr.find(
                (b) => b.id === bookmarkId && b.userId === userId,
              );
              if (!bookmark) throw new NotFoundException('No bookmark found!');
              return bookmark;
            }),
            updateBookmark: jest.fn(
              (bookmarkId: number, userId: number, dto: any) =>
                Promise.resolve({ id: 1, title: 'updated book', userId: 1 }),
            ),
            deleteBookmark: jest.fn(
              (bookmarkId: number, userId: number) => true,
            ),
          },
        },
        {
          provide: PrismaService,
          useValue: {},
        },
      ],
    }).compile();

    bookmarkController = module.get<BookmarkController>(BookmarkController);
    bookmarkService = module.get<BookmarkService>(BookmarkService);
  });

  it('bookMarkController should be defined', () => {
    expect(bookmarkController).toBeDefined();
  });

  it('bookMarkService should be defined', () => {
    expect(BookmarkService).toBeDefined();
  });

  describe('createBookmark', () => {
    it("Should call 'createBookmark' in bookMarkService", async () => {
      await bookmarkController.createBookmark(1, bookmarkDto);
      expect(bookmarkService.createBookmark).toHaveBeenCalled();
      expect(bookmarkService.createBookmark).toHaveBeenCalledTimes(1);
      expect(bookmarkService.createBookmark).toHaveBeenCalledWith(
        1,
        bookmarkDto,
      );
    });

    it('Should return new bookmark', async () => {
      const bookmark = await bookmarkController.createBookmark(2, bookmarkDto);
      expect(bookmark).toBeDefined();
      console.log(bookmark);

      expect(bookmark).toMatchObject(bookmarkDto);
    });
  });

  describe('getAllBookmarks', () => {
    it("Should call 'getAllBookmarks' in bookMarkService", async () => {
      await bookmarkController.getAllBookmarks(1, {});
      expect(bookmarkService.getAllBookmarks).toHaveBeenCalled();
    });
    it('Should return bookmarks ', async () => {
      const bookmarks = await bookmarkController.getAllBookmarks(1, {});
      expect(bookmarks).toBeDefined();
      expect(bookmarks).toBe(bookmarksArr);
      expect(bookmarks).toHaveLength(3);
    });
  });

  describe('getOneBookmarks', () => {
    it("Should call 'getOneBookmark' in bookMarkService", async () => {
      await bookmarkController.getOneBookmark(1, 1);
      expect(bookmarkService.getOneBookmark).toHaveBeenCalled();
      expect(bookmarkService.getOneBookmark).toHaveBeenCalledWith(1, 1);
    });

    it('Should return bookmark with given id', async () => {
      const result = await bookmarkController.getOneBookmark(2, 2); // example args
      expect(result).toMatchObject(bookmarksArr[1]);
    });

    it('Should throw an error if bookmark not found', async () => {
      expect.assertions(1);
      try {
        await bookmarkController.getOneBookmark(10, 2); // example args
      } catch (err) {
        expect(err).toMatchObject({ message: 'No bookmark found!' });
      }
    });
  });

  describe('updateBookmark', () => {
    it("Should call 'updateBookmark' in bookMarkService", async () => {
      await bookmarkController.updateBookmark(1, 1, bookmarkDto);
      expect(bookmarkService.updateBookmark).toHaveBeenCalled();
    });

    it('Should return updated bookmark', async () => {
      const result = await bookmarkController.updateBookmark(2, 2, bookmarkDto); // example args
      expect(result).toMatchObject({
        id: 1,
        title: 'updated book',
        userId: 1,
      });
      expect(result.title).toBe('updated book');
    });
  });

  describe('deleteBookmark', () => {
    it("Should call 'deleteBookmark' in bookMarkService", async () => {
      await bookmarkController.deleteBookmark(1, 1);
      expect(bookmarkService.deleteBookmark).toHaveBeenCalled();
    });
  });
});
