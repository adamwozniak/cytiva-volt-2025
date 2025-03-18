import { test, expect } from '@playwright/test';

const apiUrl = 'http://localhost:7071/api/graphql';

test.describe('Juvenalia GraphQL API tests', () => {
    test('200 - all events', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
              query: `
                query Events {
                  events {
                    id
                    name
                    date
                    description
                  }
                }
              `,
            },
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody.data.events).toBeDefined();
        expect(responseBody.data.events.length).toBe(9);
    });

    test('200 - concert type only', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                query: `
                query Events {
                  events(type: "concert") {
                    id
                    name
                    date
                    description
                  }
                }
              `,
            },
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody.data.events).toBeDefined();
        expect(responseBody.data.events.length).toBe(9);
    });

    test('200 - event with proper id', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                query: `
                query Event {
                  event(id: "2") {
                    id
                    name
                    date
                    description
                  }
                }
              `,
            },
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(200);
        expect(responseBody.data.event).toBeDefined();
        expect(responseBody.data.event.name).toBe('Strefa Polibuda - JuwePiątek');
    });

    test('400 - wrong query', async ({ request }) => {
        const response = await request.post(apiUrl, {
            data: {
                query: `
                YOUR QUERY HERE
              `,
            },
        });
        const responseBody = await response.json();
        expect(response.status()).toBe(400);
        expect(responseBody.errors).toBeDefined();
    });
});
