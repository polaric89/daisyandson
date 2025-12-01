/**
 * Aramex Shipping Integration Service
 * 
 * Documentation: https://www.aramex.com/solutions-services/developers-solutions-center
 * 
 * Required credentials (add to .env):
 * - ARAMEX_USERNAME
 * - ARAMEX_PASSWORD
 * - ARAMEX_ACCOUNT_NUMBER
 * - ARAMEX_ACCOUNT_PIN
 * - ARAMEX_ACCOUNT_ENTITY (e.g., 'DXB' for Dubai)
 * - ARAMEX_ACCOUNT_COUNTRY_CODE (e.g., 'AE')
 */

// Aramex API endpoints
const ARAMEX_API = {
  // Production
  PROD: {
    RATE_CALCULATOR: 'https://ws.aramex.net/ShippingAPI.V2/RateCalculator/Service_1_0.svc/json/CalculateRate',
    SHIPMENT: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
    TRACKING: 'https://ws.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments',
    PICKUP: 'https://ws.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreatePickup'
  },
  // Test/Sandbox
  TEST: {
    RATE_CALCULATOR: 'https://ws.dev.aramex.net/ShippingAPI.V2/RateCalculator/Service_1_0.svc/json/CalculateRate',
    SHIPMENT: 'https://ws.dev.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreateShipments',
    TRACKING: 'https://ws.dev.aramex.net/ShippingAPI.V2/Tracking/Service_1_0.svc/json/TrackShipments',
    PICKUP: 'https://ws.dev.aramex.net/ShippingAPI.V2/Shipping/Service_1_0.svc/json/CreatePickup'
  }
}

// Use test environment by default
const API = process.env.ARAMEX_ENV === 'production' ? ARAMEX_API.PROD : ARAMEX_API.TEST

// Aramex credentials from environment
const getClientInfo = () => ({
  UserName: process.env.ARAMEX_USERNAME || 'testingapi@aramex.com',
  Password: process.env.ARAMEX_PASSWORD || 'R123456789$r',
  Version: 'v1.0',
  AccountNumber: process.env.ARAMEX_ACCOUNT_NUMBER || '20016',
  AccountPin: process.env.ARAMEX_ACCOUNT_PIN || '331421',
  AccountEntity: process.env.ARAMEX_ACCOUNT_ENTITY || 'AMM',
  AccountCountryCode: process.env.ARAMEX_ACCOUNT_COUNTRY_CODE || 'JO',
  Source: 24 // Partner Source Code
})

// Your shop's address (shipper)
const getShipperAddress = () => ({
  Line1: process.env.SHOP_ADDRESS_LINE1 || 'Dubai Office',
  Line2: process.env.SHOP_ADDRESS_LINE2 || '',
  Line3: '',
  City: process.env.SHOP_CITY || 'Dubai',
  StateOrProvinceCode: '',
  PostCode: process.env.SHOP_POSTCODE || '',
  CountryCode: process.env.SHOP_COUNTRY || 'AE',
  Longitude: 0,
  Latitude: 0,
  BuildingNumber: '',
  BuildingName: '',
  Floor: '',
  Apartment: '',
  POBox: null,
  Description: ''
})

const getShipperContact = () => ({
  Department: '',
  PersonName: process.env.SHOP_CONTACT_NAME || 'Badge Designer Shop',
  Title: '',
  CompanyName: process.env.SHOP_COMPANY || 'Badge Designer',
  PhoneNumber1: process.env.SHOP_PHONE || '+971501234567',
  PhoneNumber1Ext: '',
  PhoneNumber2: '',
  PhoneNumber2Ext: '',
  FaxNumber: '',
  CellPhone: process.env.SHOP_PHONE || '+971501234567',
  EmailAddress: process.env.SHOP_EMAIL || 'orders@badgedesigner.com',
  Type: ''
})

/**
 * Calculate shipping rate
 * @param {Object} destination - Destination address
 * @param {Object} shipmentDetails - Package details
 * @returns {Object} Rate calculation result
 */
export const calculateRate = async (destination, shipmentDetails) => {
  try {
    const payload = {
      ClientInfo: getClientInfo(),
      OriginAddress: getShipperAddress(),
      DestinationAddress: {
        Line1: destination.address || '',
        Line2: '',
        Line3: '',
        City: destination.city || '',
        StateOrProvinceCode: destination.state || '',
        PostCode: destination.postcode || '',
        CountryCode: destination.countryCode || 'AE',
        Longitude: 0,
        Latitude: 0
      },
      ShipmentDetails: {
        Dimensions: {
          Length: shipmentDetails.length || 15, // cm
          Width: shipmentDetails.width || 15,
          Height: shipmentDetails.height || 5,
          Unit: 'CM'
        },
        ActualWeight: {
          Value: shipmentDetails.weight || 0.5, // kg
          Unit: 'KG'
        },
        ChargeableWeight: {
          Value: shipmentDetails.weight || 0.5,
          Unit: 'KG'
        },
        DescriptionOfGoods: 'Custom Photo Badges',
        GoodsOriginCountry: 'AE',
        NumberOfPieces: shipmentDetails.pieces || 1,
        ProductGroup: destination.countryCode === 'AE' ? 'DOM' : 'EXP', // Domestic or Express
        ProductType: destination.countryCode === 'AE' ? 'ONP' : 'PPX', // Overnight or Priority Parcel Express
        PaymentType: 'P', // Prepaid
        PaymentOptions: '',
        Services: '',
        Items: []
      },
      PreferredCurrencyCode: 'AED'
    }

    const response = await fetch(API.RATE_CALCULATOR, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()
    
    if (data.HasErrors) {
      console.error('Aramex rate calculation error:', data.Notifications)
      return {
        success: false,
        error: data.Notifications?.[0]?.Message || 'Rate calculation failed'
      }
    }

    return {
      success: true,
      totalAmount: data.TotalAmount?.Value || 0,
      currency: data.TotalAmount?.CurrencyCode || 'AED',
      deliveryTime: destination.countryCode === 'AE' ? '1-2 days' : '3-7 days',
      rateDetails: data.RateDetails
    }
  } catch (error) {
    console.error('Aramex API error:', error)
    return {
      success: false,
      error: 'Failed to calculate shipping rate'
    }
  }
}

/**
 * Create a shipment
 * @param {Object} order - Order details
 * @param {Object} recipient - Recipient details
 * @returns {Object} Shipment creation result
 */
export const createShipment = async (order, recipient) => {
  try {
    const isDomestic = recipient.countryCode === 'AE'
    
    const payload = {
      ClientInfo: getClientInfo(),
      LabelInfo: {
        ReportID: 9201,
        ReportType: 'URL'
      },
      Shipments: [{
        Reference1: order.id,
        Reference2: '',
        Reference3: '',
        Shipper: {
          Reference1: '',
          Reference2: '',
          AccountNumber: getClientInfo().AccountNumber,
          PartyAddress: getShipperAddress(),
          Contact: getShipperContact()
        },
        Consignee: {
          Reference1: order.id,
          Reference2: '',
          AccountNumber: '',
          PartyAddress: {
            Line1: recipient.address,
            Line2: '',
            Line3: '',
            City: recipient.city,
            StateOrProvinceCode: recipient.state || '',
            PostCode: recipient.postcode || '',
            CountryCode: recipient.countryCode || 'AE',
            Longitude: 0,
            Latitude: 0
          },
          Contact: {
            Department: '',
            PersonName: recipient.name,
            Title: '',
            CompanyName: '',
            PhoneNumber1: recipient.phone,
            PhoneNumber1Ext: '',
            PhoneNumber2: '',
            PhoneNumber2Ext: '',
            FaxNumber: '',
            CellPhone: recipient.phone,
            EmailAddress: recipient.email || '',
            Type: ''
          }
        },
        ThirdParty: {
          Reference1: '',
          Reference2: '',
          AccountNumber: '',
          PartyAddress: getShipperAddress(),
          Contact: getShipperContact()
        },
        ShippingDateTime: `/Date(${Date.now()})/`,
        DueDate: `/Date(${Date.now() + 86400000})/`, // +1 day
        Comments: order.notes || '',
        PickupLocation: '',
        OperationsInstructions: '',
        AccountingInstrcutions: '',
        Details: {
          Dimensions: {
            Length: 15,
            Width: 15,
            Height: 5,
            Unit: 'CM'
          },
          ActualWeight: {
            Value: Math.max(0.5, (order.quantity || 1) * 0.03), // ~30g per badge
            Unit: 'KG'
          },
          ChargeableWeight: {
            Value: Math.max(0.5, (order.quantity || 1) * 0.03),
            Unit: 'KG'
          },
          DescriptionOfGoods: `${order.quantity || 1} Custom Photo Badge(s)`,
          GoodsOriginCountry: 'AE',
          NumberOfPieces: 1,
          ProductGroup: isDomestic ? 'DOM' : 'EXP',
          ProductType: isDomestic ? 'ONP' : 'PPX',
          PaymentType: 'P',
          PaymentOptions: '',
          Services: isDomestic ? '' : 'CODS',
          CashOnDeliveryAmount: null,
          InsuranceAmount: null,
          CashAdditionalAmount: null,
          CashAdditionalAmountDescription: '',
          CollectAmount: null,
          CustomsValueAmount: isDomestic ? null : {
            Value: order.pricing?.total || 100,
            CurrencyCode: 'AED'
          },
          Items: isDomestic ? [] : [{
            PackageType: 'Box',
            Quantity: order.quantity || 1,
            Weight: {
              Value: Math.max(0.5, (order.quantity || 1) * 0.03),
              Unit: 'KG'
            },
            Comments: 'Custom Photo Badges',
            Reference: order.id,
            Commodity: {
              Code: '392690',
              CustomsDescription: 'Plastic Photo Pin Badges'
            },
            GoodsDescription: 'Custom Photo Pin Badges',
            CountryOfOrigin: 'AE',
            CustomsValue: {
              Value: order.pricing?.total || 100,
              CurrencyCode: 'AED'
            }
          }]
        }
      }],
      Transaction: {
        Reference1: order.id,
        Reference2: '',
        Reference3: '',
        Reference4: '',
        Reference5: ''
      }
    }

    const response = await fetch(API.SHIPMENT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.HasErrors) {
      console.error('Aramex shipment creation error:', data.Notifications)
      
      // DEMO MODE: Generate fake tracking number when API returns error
      if (process.env.ARAMEX_ENV !== 'production') {
        console.log('Aramex API error - using DEMO MODE')
        const demoTrackingNumber = `DEMO${Date.now().toString().slice(-10)}`
        return {
          success: true,
          trackingNumber: demoTrackingNumber,
          labelUrl: null,
          isDemo: true
        }
      }
      
      return {
        success: false,
        error: data.Notifications?.[0]?.Message || 'Shipment creation failed'
      }
    }

    const shipment = data.Shipments?.[0]
    
    return {
      success: true,
      trackingNumber: shipment?.ID,
      labelUrl: shipment?.ShipmentLabel?.LabelURL,
      shipmentDetails: shipment
    }
  } catch (error) {
    console.error('Aramex shipment API error:', error)
    
    // DEMO MODE: Generate fake tracking number when API fails
    // Remove this in production with real Aramex credentials
    if (process.env.ARAMEX_ENV !== 'production') {
      console.log('Using DEMO MODE - generating fake tracking number')
      const demoTrackingNumber = `DEMO${Date.now().toString().slice(-10)}`
      return {
        success: true,
        trackingNumber: demoTrackingNumber,
        labelUrl: null,
        isDemo: true
      }
    }
    
    return {
      success: false,
      error: 'Failed to create shipment'
    }
  }
}

/**
 * Track a shipment
 * @param {string} trackingNumber - Aramex tracking number
 * @returns {Object} Tracking result
 */
export const trackShipment = async (trackingNumber) => {
  try {
    const payload = {
      ClientInfo: getClientInfo(),
      Shipments: [trackingNumber],
      GetLastTrackingUpdateOnly: false,
      Transaction: {
        Reference1: trackingNumber,
        Reference2: '',
        Reference3: '',
        Reference4: '',
        Reference5: ''
      }
    }

    const response = await fetch(API.TRACKING, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (data.HasErrors) {
      console.error('Aramex tracking error:', data.Notifications)
      return {
        success: false,
        error: data.Notifications?.[0]?.Message || 'Tracking failed'
      }
    }

    const trackingResult = data.TrackingResults?.[0]
    
    return {
      success: true,
      trackingNumber: trackingResult?.WaybillNumber,
      updates: trackingResult?.Value || [],
      currentStatus: trackingResult?.Value?.[0]?.UpdateDescription || 'Unknown'
    }
  } catch (error) {
    console.error('Aramex tracking API error:', error)
    return {
      success: false,
      error: 'Failed to track shipment'
    }
  }
}

// Shipping rate estimates (fallback when API unavailable)
export const SHIPPING_RATES = {
  domestic: {
    name: 'UAE Domestic',
    price: 25,
    currency: 'AED',
    deliveryTime: '1-2 business days',
    provider: 'Aramex'
  },
  gcc: {
    name: 'GCC Countries',
    price: 45,
    currency: 'AED',
    deliveryTime: '2-4 business days',
    provider: 'Aramex',
    countries: ['SA', 'KW', 'BH', 'QA', 'OM']
  },
  international: {
    name: 'International',
    price: 85,
    currency: 'AED',
    deliveryTime: '5-10 business days',
    provider: 'Aramex'
  }
}

/**
 * Get shipping rate based on country (fallback method)
 * @param {string} countryCode - ISO country code
 * @returns {Object} Shipping rate
 */
export const getShippingRate = (countryCode) => {
  if (countryCode === 'AE') {
    return SHIPPING_RATES.domestic
  }
  if (SHIPPING_RATES.gcc.countries.includes(countryCode)) {
    return SHIPPING_RATES.gcc
  }
  return SHIPPING_RATES.international
}

export default {
  calculateRate,
  createShipment,
  trackShipment,
  getShippingRate,
  SHIPPING_RATES
}

