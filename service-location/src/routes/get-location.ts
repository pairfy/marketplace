import { Request, Response } from "express";
import axios from "axios";

const getLocation = async (req: Request, res: Response) => {
  try {
    console.log(req.publicAddress, req.ip);

    const response = await axios.get(
      `http://ip-api.com/json/${req.publicAddress}`
    );

    console.log(response.data);

    res.status(200).send({ success: true, payload: response.data.countryCode });
  } catch (err: any) {
    res.status(404).send({ success: false });
  }
};

export { getLocation };
