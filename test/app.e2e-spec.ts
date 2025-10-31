import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('Reservify E2E Tests (Events + Bookings)', () => {
  let app: INestApplication;
  let eventId: number;
  let bookingId: number;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('POST /api/events → should create a new event', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/events')
      .send({ name: 'Music Concert', totalSeats: 50 })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('id');
    eventId = res.body.data.id;
  });

  it('GET /api/events → should return list of events', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/events')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/events/:id → should return event by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/events/${eventId}`)
      .expect(200);

    expect(res.body.data.id).toBe(eventId);
  });

  it('PATCH /api/events/:id → should update event name', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/events/${eventId}`)
      .send({ name: 'Updated Concert' })
      .expect(200);

    expect(res.body.message).toContain('updated');
    expect(res.body.data.name).toBe('Updated Concert');
  });

  it('DELETE /api/events/:id → should delete event', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/events/${eventId}`)
      .expect(200);

    expect(res.body.message).toContain('deleted');
  });


  it('POST /api/bookings/reserve → should create a new booking', async () => {
    const eventRes = await request(app.getHttpServer())
      .post('/api/events')
      .send({ name: 'Tech Meetup', totalSeats: 30 })
      .expect(201);
    eventId = eventRes.body.data.id;

    const res = await request(app.getHttpServer())
      .post('/api/bookings/reserve')
      .send({
        event_id: eventId,
        user_id: 'test_user_1'
      })
      .expect(201);

    expect(res.body.success).toBe(true);
    expect(res.body.message).toBe('Booking created successfully');
    expect(res.body.data).toHaveProperty('id');
    bookingId = res.body.data.id;
  });

  it('GET /api/bookings → should return list of bookings', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/bookings')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/bookings/:id → should return booking by id', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/bookings/${bookingId}`)
      .expect(200);

    expect(res.body.data.id).toBe(bookingId);
  });

  it('DELETE /api/bookings/:id → should delete booking', async () => {
    const res = await request(app.getHttpServer())
      .delete(`/api/bookings/${bookingId}`)
      .expect(200);

    expect(res.body.message).toContain('deleted');
  });
});
