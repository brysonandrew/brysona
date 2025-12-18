// src/routes/businesses.ts
import { TBusiness, searchBusinessesViaPlaces } from '@ops/outreacher/google-places';
import type { Request, Response } from 'express';


export type TSearchBusinessesRequestBody = {
  businessType: string;
  location: string;
  limit?: number;
};

export type TSearchBusinessesResponseBody = {
  query: {
    businessType: string;
    location: string;
    limit: number;
  };
  count: number;
  businesses: TBusiness[];
};

export const handleSearchBusinesses = async (
  req: Request<unknown, unknown, TSearchBusinessesRequestBody>,
  res: Response<TSearchBusinessesResponseBody | { error: string; details?: unknown }>,
): Promise<Response> => {
  try {
    const { businessType, location, limit } = req.body || {};

    if (!businessType || !location) {
      return res.status(400).json({
        error: 'Missing required fields: "businessType" and/or "location".',
      });
    }

    const safeLimit =
      typeof limit === 'number' && limit > 0 ? Math.min(limit, 50) : 20;

    const businesses = await searchBusinessesViaPlaces({
      businessType: businessType.trim(),
      location: location.trim(),
      limit: safeLimit,
    });

    return res.json({
      query: {
        businessType: businessType.trim(),
        location: location.trim(),
        limit: safeLimit,
      },
      count: businesses.length,
      businesses,
    });
  } catch (err: any) {
    // Log raw error for your server
    console.error('Business search error:', err?.response?.data || err);

    const statusCode = err?.response?.status ?? 500;

    return res.status(statusCode).json({
      error: 'Failed to search businesses',
      details: err?.response?.data ?? err?.message ?? 'Unknown error',
    });
  }
};