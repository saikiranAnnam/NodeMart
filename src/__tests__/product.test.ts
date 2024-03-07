import supertest from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import createServer from "../utils/server";
import { createProduct } from "../service/product.services";
import { signJwt } from "../utils/jwt.utils";
import { v4 as uuidv4 } from "uuid";

const app = createServer();

export const userId = new mongoose.Types.ObjectId().toString();
export const uuid = uuidv4();

export const productPayload = {
  user: userId,
  title: "Canon EOS 1700D DSLR Camera with 18-55mm Lens",
  description:
    "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
  price: 679.99,
  image: "https://i.imgur.com/QlRphfQ.jpg",
  productId: uuid,
};

export const userPayload = {
  _id: userId,
  email: "johndoe@gmail.com",
  name: "John doe",
};

describe("product", () => {
  beforeAll(async () => {
    const mongoServer = await MongoMemoryServer.create();
    await mongoose.connect(mongoServer.getUri());
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  // get the product test
  describe("get product route", () => {
    //testcase - 1: when product doesnt exists in the db
    describe("given the product doesn't exist", () => {
      it("should return a 404", async () => {
        const productId = "product-123";

        await supertest(app).get(`/api/products/${productId}`).expect(404);
      });
    });

    //testcase-2 : when product does exists in db
    describe("given the product does exist", () => {
      it("should return a 200 and the product", async () => {
        const product = await createProduct(productPayload);

        const { body, statusCode } = await supertest(app).get(
          `/api/products/${product.productId}`
        );
        expect(statusCode).toBe(200);
      });
    });
  });

  /// create the product test
  describe("create product route", () => {
    //unauthenicated user
    describe("given the user is not logged in", () => {
      it("it should return a 403", async () => {
        const { statusCode } = await supertest(app).post("/api/products");
        expect(statusCode).toBe(403); //here we hit the requireUser middleware in the createProduct route
      });
    });

    //authenicated user
    describe.skip("given the user is logged in", () => {
      it("should return a 200 and create the product", async () => {
        const jwt = signJwt(userPayload);

        const { statusCode, body } = await supertest(app)
          .post("/api/products")
          .set("Authorization", `Bearer ${jwt}`)
          .send(productPayload);

        expect(statusCode).toBe(200);

        expect(body).toEqual({
          __v: 0,
          _id: expect.any(String),
          createdAt: expect.any(String),
          description:
            "Designed for first-time DSLR owners who want impressive results straight out of the box, capture those magic moments no matter your level with the EOS 1500D. With easy to use automatic shooting modes, large 24.1 MP sensor, Canon Camera Connect app integration and built-in feature guide, EOS 1500D is always ready to go.",
          image: "https://i.imgur.com/QlRphfQ.jpg",
          price: 879.99,
          productId: expect.any(String),
          title: "Canon EOS 1500D DSLR Camera with 18-55mm Lens",
          updatedAt: expect.any(String),
          user: expect.any(String),
        });
      });
    });
  });
});
