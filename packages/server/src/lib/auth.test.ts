// Tests for auth library
import { hashPassword } from './auth';

describe("auth", () => {
  describe("hashPassword", () => {
    it("should hash a password", async () => {
      const password = "password";
      const hashedPassword = await hashPassword(password);
      expect(hashedPassword).not.toEqual(password);
      expect(hashedPassword).toHaveLength(60);
    });
  });
});

