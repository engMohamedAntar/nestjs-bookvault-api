//bookmark.service.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { BookmarkService } from './bookmark.service';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBookmarkDto } from '../dto/create-bookmark-dto';
import { UpdateBookmarkDto } from '../dto/update-bookmark-dto';

describe('BookmarkService', () => {
  let bookmarkService: BookmarkService;
  let prismaService: PrismaService;
  const createBookmarkDto: CreateBookmarkDto = {
    title: 'bookMark',
    description: 'bookMark desc',
    link: 'http://bookmark/1',
  };

  const bookmarks = [
    { id: 1, title: 'first bookmark', userId: 1 },
    { id: 2, title: 'second bookmark', userId: 1 },
    { id: 3, title: 'third bookmark', userId: 5 },
    { id: 4, title: 'forth bookmark', userId: 6 },
  ];

  type findUniqueParam = { where: { id: number } };
  type findFirstParam = { where: { id: number; userId: number } };

  const updateBookmark: UpdateBookmarkDto = {
    title: 'new name',
    description: 'new description',
    link: 'new link',
  };

  const mockPrismaService = {
    bookmark: {
      create: jest.fn(({ data }) => Promise.resolve({ id: 10, ...data })),
      findMany: jest.fn(() =>
        Promise.resolve([{ id: 1, title: 'Test bookmark' }]),
      ),
      count: jest.fn(() => Promise.resolve(100)),
      findUnique: jest.fn((param: findUniqueParam) =>
        Promise.resolve(bookmarks.find((b) => b.id === param.where.id)),
      ),
      findFirst: jest.fn((param: findFirstParam) =>
        Promise.resolve(
          bookmarks.find(
            (b) => b.id === param.where.id && b.userId === param.where.userId,
          ),
        ),
      ),
      update: jest.fn(() =>
        Promise.resolve({ id: 1, title: 'updated bookmark', userId: 1 }),
      ),
      delete: jest.fn(() => Promise.resolve()),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        BookmarkService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    bookmarkService = module.get<BookmarkService>(BookmarkService);
    prismaService = module.get<PrismaService>(PrismaService);
  });
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('bookmarkService should be defined', () => {
    expect(bookmarkService).toBeDefined();
  });

  it('PrismaService should be defined', () => {
    expect(prismaService).toBeDefined();
  });

  describe('createBookmark', () => {
    it("Should call 'create' method in bookmark repo", async () => {
      await bookmarkService.createBookmark(1, createBookmarkDto);
      expect(prismaService.bookmark.create).toHaveBeenCalled();
      expect(prismaService.bookmark.create).toHaveBeenCalledTimes(1);
    });

    it('Should creat a new bookMark', async () => {
      const result = await bookmarkService.createBookmark(2, createBookmarkDto);
      expect(result).toBeDefined();
      expect(result.id).toBe(10);
      expect(result.title).toBe('bookMark');
      expect(prismaService.bookmark.create).toHaveBeenCalledTimes(1);
    });
  });

  describe('getAllBookmarks', () => {
    it("Should call 'count' method in bookmark repo", async () => {
      await bookmarkService.getAllBookmarks(1, {});
      expect(prismaService.bookmark.count).toHaveBeenCalled();
      expect(prismaService.bookmark.count).toHaveBeenCalledTimes(1);
    });

    it("Should call 'findMany' method in bookmark repo", async () => {
      await bookmarkService.getAllBookmarks(1, {});
      expect(prismaService.bookmark.findMany).toHaveBeenCalled();
      expect(prismaService.bookmark.findMany).toHaveBeenCalledTimes(1);
    });

    it('Should return bookmarks', async () => {
      const result = await bookmarkService.getAllBookmarks(1, {});
      expect(result).toBeDefined();
    });

    it('should return bookmarks and pagination info', async () => {
      const result = await bookmarkService.getAllBookmarks(1, {});
      expect(result).toEqual({
        paginationInfo: expect.any(Object),
        bookmarks: [{ id: 1, title: 'Test bookmark' }],
      });
    });

    it('result should have length of 1', async () => {
      const result = await bookmarkService.getAllBookmarks(1, {});
      expect(result.bookmarks).toHaveLength(1);
    });
  });

  describe('getOneBookmark', () => {
    it("Should call 'findUnique' method in bookmark repo", async () => {
      await bookmarkService.getOneBookmark(1, 3);
      expect(prismaService.bookmark.findUnique).toHaveBeenCalled();
      expect(prismaService.bookmark.findUnique).toHaveBeenCalledTimes(1);
    });

    it('Should return product with id 2', async () => {
      const product = await bookmarkService.getOneBookmark(2, 3);
      expect(product).toMatchObject(bookmarks[1]);
    });

    it('If no bookmark returned throw error', async () => {
      expect.assertions(1);
      try {
        await bookmarkService.getOneBookmark(20, 3);
      } catch (err) {
        expect(err).toMatchObject({ message: 'No bookmark found for this id' });
      }
    });
  });

  describe('updateBookmark', () => {
    it("Should call 'findFirst' method in bookmark repo", async () => {
      await bookmarkService.updateBookmark(1, 1, updateBookmark);
      expect(prismaService.bookmark.findFirst).toHaveBeenCalled();
    });
    it("Should call 'update' method in bookmark repo", async () => {
      await bookmarkService.updateBookmark(1, 1, updateBookmark);
      expect(prismaService.bookmark.update).toHaveBeenCalled();
    });

    it('Should  return updated bookmark', async () => {
      const updated = await bookmarkService.updateBookmark(
        1,
        1,
        updateBookmark,
      );
      expect(updated).toBeDefined();
    });

    it('throw exception if no result', async () => {
      expect.assertions(1);
      try {
        await bookmarkService.updateBookmark(20, 1, updateBookmark);
      } catch (err) {
        expect(err).toMatchObject({ message: 'Access denied' });
      }
    });
  });

  describe('deleteBookmark', () => {
    it("  Should call 'findFirst' method in bookmark repo", async () => {
      await bookmarkService.deleteBookmark(1, 1);
      expect(prismaService.bookmark.findFirst).toHaveBeenCalled();
    });

    it("  Should call 'delete' method in bookmark repo", async () => {
      await bookmarkService.deleteBookmark(1, 1);
      expect(prismaService.bookmark.delete).toHaveBeenCalled();
    });

    it('throw exception if no bookmark found', async () => {
      expect.assertions(1);
      try {
        await bookmarkService.deleteBookmark(20, 1);
      } catch (err) {
        expect(err).toMatchObject({ message: 'Access denied' });
      }
    });
  });
});
