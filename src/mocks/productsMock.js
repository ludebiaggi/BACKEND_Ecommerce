import { fakerFR as faker } from "@faker-js/faker";

export const generateFakeProducts = () => {
  const fakeProducts = {
    title: faker.commerce.productName(),
    description: faker.commerce.productDescription(),
    //code: faker.randomizer.next(),
    price: faker.commerce.price(),
    stock: faker.number.int(100),
    //status: faker.datatype.boolean(0.9)
    category: faker.commerce.department(),
    thumbnails: [faker.image.url()],
  };
  return fakeProducts;
};

