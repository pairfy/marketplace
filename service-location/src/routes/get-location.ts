import { Request, Response } from "express";
import { geoAPI } from "../api";

const getLocation = async (req: Request, res: Response) => {
  try {
    console.log(req.publicAddress, req.ip);

    const getLocation = await geoAPI.get(`178.238.11.6?token=f76c9e2af54296`);

    if (getLocation.status !== 200) {
      throw new Error("INTERNAL_ERROR");
    }

    console.log(getLocation.data);

    const { city, region, country, postal } = getLocation.data;

    const payload = {
      city,
      region,
      country,
      postal
    };

    res
      .status(200)
      .send({ success: true, payload: payload });
  } catch (err: any) {
    res.status(404).send({ success: false });
  }
};

export { getLocation };
