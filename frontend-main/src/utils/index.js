import dayjs from 'dayjs'
import notificationSound from '@/assets/notification.mp3';
import { ref } from 'vue';

export function formatWithDots(str, reduce) {
  const len = str.length

  if (len <= 2 + reduce) return str

  const mid = Math.floor(len / 2)
  const start = str.slice(0, mid - Math.floor(reduce / 2))
  const end = str.slice(mid + Math.ceil(reduce / 2))

  return start + '...' + end
}

export function reduceByLength(input, length) {
  if (input.length > length) {
    return input.slice(0, length) + '...'
  }

  return input
}

export function formatCurrency(value) {
  if (value) {
    let result = value.toLocaleString('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })

    return result
  }
}

export function applyDiscount(active, originalPrice, discountPercent) {
  if (!active) {
    return originalPrice
  }

  if (discountPercent < 0 || discountPercent > 100) {
    throw new Error('Discount percentage must be between 0 and 100')
  }

  const discountAmount = (originalPrice * discountPercent) / 100

  const discountedPrice = originalPrice - discountAmount

  return Math.round(discountedPrice)
}

/**
 * Converts USD to ADA.
 * @param {number} usdAmount - The amount in USD to convert.
 * @param {number} adaPrice - The price of 1 ADA in USD.
 * @returns {number} The converted ADA amount as a number.
 */
export function convertUSDToADA(usdAmount, adaPrice) {
  if (usdAmount < 0) {
    throw new Error('USD amount cannot be negative.')
  }

  if (adaPrice <= 0) {
    throw new Error('ADA price must be greater than 0.')
  }

  const amountInADA = usdAmount / adaPrice

  return Math.round(amountInADA)
}

export function convertLovelaceToADA(lovelace) {
  if (lovelace <= 0) {
    throw new Error('ADA price must be greater than 0.')
  }

  const amountInADA = lovelace / 1_000_000

  return amountInADA.toFixed(2)
}

/**
 * Converts lovelace to USD.
 * @param {number} lovelace - The amount in lovelace to convert.
 * @param {number} adaPrice - The price of 1 ADA in USD.
 * @returns {number} The converted USD amount.
 */
export function convertLovelaceToUSD(lovelace, adaPrice) {
  if (lovelace <= 0) {
    throw new Error('lovelace amount must be greater than 0.')
  }

  if (adaPrice <= 0) {
    throw new Error('ADA price must be greater than 0.')
  }

  const amountInADA = lovelace / 1_000_000

  const amountInUSD = amountInADA * adaPrice

  return Math.round(amountInUSD)
}

export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text)
    console.log('Text copied to clipboard:', text)
  } catch (err) {
    console.error('Failed to copy text: ', err)
  }
}

export const convertDate = (timestamp, type) => {
  let format = 'YYYY-MM-DD'

  if (type === 1) {
    format = 'YYYY-MM-DD mm:ss'
  }

  if (type === 2) {
    format = 'YYYY-MM-DD / hh:mm:ss'
  }

  const date = dayjs(parseInt(timestamp))

  return date.format(format)
}

export function setupAudio() {
  const audio = ref(new Audio(notificationSound))

  audio.muted = false

  audio.value.load()

  audio.value.volume = 0.2

  const playNotification = () => {
    audio.value
      .play()
      .then(() => {
        console.log('Notification')
      })
      .catch((error) => {
        console.error('Unable to play sound:', error)
      })
  }

  return { playNotification }
}


export function formatPriceToUSD(amount) {
  return new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
  }).format(amount);
}


export function randomString(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const charactersLength = characters.length;

  for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }

  return result.toLocaleLowerCase();
} 