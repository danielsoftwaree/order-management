/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
  protected getTracker(req: Record<string, any>): Promise<string> {
    const user = req.user;
    if (user) {
      return Promise.resolve(user.id);
    }

    return Promise.resolve(req.ip);
  }

  protected throwThrottlingException(): Promise<void> {
    throw new HttpException(
      'Too many requests. Please wait a moment.',
      HttpStatus.TOO_MANY_REQUESTS
    );
  }
}