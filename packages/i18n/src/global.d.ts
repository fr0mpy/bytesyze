import type en from '../messages/en/common.json'

type CommonMessages = typeof en

type Messages = CommonMessages

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface IntlMessages extends Messages {}
}
