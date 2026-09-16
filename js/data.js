(function () {
  function toIsoDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  const today = new Date();
  const pickupDate = toIsoDate(addDays(today, 2));
  const deliveryDate = toIsoDate(addDays(today, 3));

  const oneWayLanes = [
    { laneNumber: "LN-1001", originCity: "Dallas",      originState: "TX", destinationCity: "Atlanta",     destinationState: "GA", miles: 781,  rate: 1952.5 },
    { laneNumber: "LN-1002", originCity: "Atlanta",     originState: "GA", destinationCity: "Dallas",      destinationState: "TX", miles: 781,  rate: 1952.5 },
    { laneNumber: "LN-1003", originCity: "Chicago City",originState: "IL", destinationCity: "Dallas",      destinationState: "TX", miles: 925,  rate: 2312   },
    { laneNumber: "LN-1004", originCity: "Dallas",      originState: "TX", destinationCity: "Houston",     destinationState: "TX", miles: 240,  rate: 600    },
    { laneNumber: "LN-1005", originCity: "Houston",     originState: "TX", destinationCity: "Atlanta",     destinationState: "GA", miles: 794,  rate: 1985   },
    { laneNumber: "LN-1006", originCity: "Los Angeles", originState: "CA", destinationCity: "Phoenix",     destinationState: "AZ", miles: 373,  rate: 932.5  },
    { laneNumber: "LN-1007", originCity: "Phoenix",     originState: "AZ", destinationCity: "Dallas",      destinationState: "TX", miles: 1065, rate: 2662.5 },
    { laneNumber: "LN-1013", originCity: "Atlanta",     originState: "GA", destinationCity: "Jacksonville",destinationState: "FL", miles: 346,  rate: 865    },
    { laneNumber: "LN-1015", originCity: "Miami",       originState: "FL", destinationCity: "Orlando",     destinationState: "FL", miles: 236,  rate: 590    },
    { laneNumber: "LN-1016", originCity: "Orlando",     originState: "FL", destinationCity: "Charlotte",   destinationState: "NC", miles: 527,  rate: 1317.5 },
    { laneNumber: "LN-1041", originCity: "Orlando",     originState: "FL", destinationCity: "Atlanta",     destinationState: "GA", miles: 438,  rate: 1095   },
    { laneNumber: "LN-1042", originCity: "Atlanta",     originState: "GA", destinationCity: "Orlando",     destinationState: "FL", miles: 438,  rate: 1095   },
    { laneNumber: "LN-1045", originCity: "Atlanta",     originState: "GA", destinationCity: "Charlotte",   destinationState: "NC", miles: 245,  rate: 612.5  },
    { laneNumber: "LN-1046", originCity: "Charlotte",   originState: "NC", destinationCity: "Atlanta",     destinationState: "GA", miles: 245,  rate: 612.5  },
    { laneNumber: "LN-1047", originCity: "Atlanta",     originState: "GA", destinationCity: "Nashville",   destinationState: "TN", miles: 250,  rate: 625    },
    { laneNumber: "LN-1050", originCity: "Jacksonville",originState: "FL", destinationCity: "Atlanta",     destinationState: "GA", miles: 346,  rate: 865    },
    { laneNumber: "LN-1079", originCity: "San Diego",   originState: "CA", destinationCity: "Atlanta",     destinationState: "GA", miles: 2150, rate: 5375   },
    { laneNumber: "LN-1075", originCity: "San Diego",   originState: "CA", destinationCity: "Las Vegas",   destinationState: "NV", miles: 332,  rate: 830    },
    { laneNumber: "LN-1070", originCity: "Fresno",      originState: "CA", destinationCity: "San Diego",   destinationState: "CA", miles: 333,  rate: 832.5  },
    { laneNumber: "LN-1068", originCity: "Sacramento",  originState: "CA", destinationCity: "San Diego",   destinationState: "CA", miles: 500,  rate: 1250   },
    { laneNumber: "LN-1063", originCity: "San Diego",   originState: "CA", destinationCity: "Phoenix",     destinationState: "AZ", miles: 355,  rate: 887.5  },
  ];

  // Round-trip lanes: outbound pickup = today+2, outbound delivery = today+3,
  // return pickup = today+4, return delivery = today+5
  const returnPickupDate  = toIsoDate(addDays(today, 4));
  const returnDeliveryDate = toIsoDate(addDays(today, 5));

  const roundTripLanes = [
    { laneNumber: "RT-2001", originCity: "Dallas",      originState: "TX", destinationCity: "Atlanta",     destinationState: "GA", miles: 781,  rate: 3200  },
    { laneNumber: "RT-2002", originCity: "Atlanta",     originState: "GA", destinationCity: "Charlotte",   destinationState: "NC", miles: 245,  rate: 1050  },
    { laneNumber: "RT-2003", originCity: "Houston",     originState: "TX", destinationCity: "Dallas",      destinationState: "TX", miles: 240,  rate: 980   },
    { laneNumber: "RT-2004", originCity: "Orlando",     originState: "FL", destinationCity: "Atlanta",     destinationState: "GA", miles: 438,  rate: 1750  },
    { laneNumber: "RT-2005", originCity: "Los Angeles", originState: "CA", destinationCity: "Phoenix",     destinationState: "AZ", miles: 373,  rate: 1540  },
    { laneNumber: "RT-2006", originCity: "Phoenix",     originState: "AZ", destinationCity: "Dallas",      destinationState: "TX", miles: 1065, rate: 4200  },
    { laneNumber: "RT-2007", originCity: "Jacksonville",originState: "FL", destinationCity: "Miami",       destinationState: "FL", miles: 350,  rate: 1380  },
    { laneNumber: "RT-2008", originCity: "San Diego",   originState: "CA", destinationCity: "Las Vegas",   destinationState: "NV", miles: 332,  rate: 1340  },
  ];

  // ── Real fixed-date round trips ──────────────────────────────────────
  const fixedRoundTripLanes = [
    {
      laneNumber:           "RT-3001",
      originCity:           "Miami",
      originState:          "FL",
      destinationCity:      "Atlanta",
      destinationState:     "GA",
      dh:                   null,
      miles:                805,
      weight:               1500,
      pallets:              2,
      rate:                 2000,
      pickup:               "2026-01-02",
      pickupWindow:         "8:00 AM – 10:00 AM",
      delivery:             "2026-01-02",
      returnOriginCity:     "Atlanta",
      returnOriginState:    "GA",
      returnDestCity:       "Miami",
      returnDestState:      "FL",
      returnDH:             null,
      returnMiles:          720,
      returnWeight:         2700,
      returnPallets:        2,
      returnRate:           1800,
      returnPickup:         "2026-01-03",
      returnPickupWindow:   "8:00 AM – 10:00 AM",
      returnDelivery:       "2026-01-03",
    },
    {
      laneNumber:           "RT-3002",
      originCity:           "Atlanta",
      originState:          "GA",
      originAddress:        "3800 Naturally Fresh Blvd, Atlanta, GA 30349",
      destinationCity:      "Orlando",
      destinationState:     "FL",
      destinationAddress:   "10900 Central Port Dr, Orlando, FL 32824",
      dh:                   10,
      miles:                600,
      weight:               2700,
      pallets:              2,
      rate:                 1500,
      pickup:               "2026-04-20",
      pickupWindow:         "8:00 AM – 10:00 AM",
      delivery:             "2026-04-20",
      returnOriginCity:     "Orlando",
      returnOriginState:    "FL",
      returnOriginAddress:  "10900 Central Port Dr, Orlando, FL 32824",
      returnDestCity:       "Atlanta",
      returnDestState:      "GA",
      returnDestAddress:    "1775 Continental Way, Atlanta, GA 30316",
      returnDH:             null,
      returnMiles:          500,
      returnWeight:         1500,
      returnPallets:        2,
      returnRate:           1400,
      returnPickup:         "2026-04-21",
      returnPickupWindow:   "8:00 AM – 10:00 AM",
      returnDelivery:       "2026-04-21",
    },
    {
      laneNumber:           "RT-3003",
      originCity:           "Fort Worth",
      originState:          "TX",
      destinationCity:      "Atlanta",
      destinationState:     "GA",
      dh:                   null,
      miles:                813,
      weight:               2900,
      pallets:              2,
      rate:                 2000,
      pickup:               "2026-07-13",
      pickupWindow:         "3:00 PM – 5:00 PM",
      delivery:             "2026-07-14",
      returnOriginCity:     "Atlanta",
      returnOriginState:    "GA",
      returnDestCity:       "Houston",
      returnDestState:      "TX",
      returnDH:             null,
      returnMiles:          783,
      returnWeight:         2300,
      returnPallets:        2,
      returnRate:           2000,
      returnPickup:         "2026-07-14",
      returnPickupWindow:   "8:00 AM – 10:00 AM",
      returnDelivery:       "2026-07-15",
    },
  ];

  window.PAK_TRANSPORTATION = {
    company: {
      name:        "Active Carriers Corporation",
      shortName:   "Active Carriers",
      usdot:       "3735366",
      usdotStatus: "ACTIVE",
      mc:          "MC-1434047",
      phone:       "(415) 300-0938",
      email:       "team@activecarrierscorporation.com",
      address:     "10825 1st Street",
      city:        "Gilroy",
      state:       "CA",
      zip:         "95020",
      location:    "Gilroy, CA 95020",
      hours:       "Mon - Fri, 7:00 AM - 7:00 PM",
    },
    lanes: [
      ...oneWayLanes.map((lane) => ({
        ...lane,
        type: "one-way",
        pickup: pickupDate,
        delivery: deliveryDate,
      })),
      ...roundTripLanes.map((lane) => ({
        ...lane,
        type: "round-trip",
        pickup: pickupDate,
        delivery: deliveryDate,
        returnPickup: returnPickupDate,
        returnDelivery: returnDeliveryDate,
      })),
      ...fixedRoundTripLanes.map((lane) => ({
        ...lane,
        type: "round-trip",
      })),
    ],
  };
})();
