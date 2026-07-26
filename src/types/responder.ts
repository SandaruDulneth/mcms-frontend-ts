export type ResponseType =
  | 'rescue'
  | 'medical'
  | 'food_water'
  | 'shelter'
  | 'transport'
  | 'donation'
  | 'information'
  | 'other';

export type ResponderStatus =
  | 'offered'
  | 'en_route'
  | 'arrived'
  | 'completed';

export type Responder = {
  _id         : string;
  reportId    : string;
  name        : string;
  organization?: string;
  responseType: ResponseType;
  message     : string;
  contactInfo?: string;
  status      : ResponderStatus;
  createdAt   : string;
  updatedAt   : string;
};

export type CreateResponderInput = {
  name        : string;
  organization?: string;
  responseType: ResponseType;
  message     : string;
  contactInfo?: string;
};

// Labels, icons, colours for each response type
export const RESPONSE_TYPE_META: Record<
  ResponseType,
  { label: string; emoji: string; colour: string }
> = {
  rescue     : { label: 'Rescue',       emoji: '🚨', colour: 'bg-red-100 text-red-700 border-red-200'      },
  medical    : { label: 'Medical',      emoji: '🏥', colour: 'bg-pink-100 text-pink-700 border-pink-200'    },
  food_water : { label: 'Food & Water', emoji: '🍱', colour: 'bg-orange-100 text-orange-700 border-orange-200' },
  shelter    : { label: 'Shelter',      emoji: '🏠', colour: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
  transport  : { label: 'Transport',    emoji: '🚗', colour: 'bg-blue-100 text-blue-700 border-blue-200'    },
  donation   : { label: 'Donation',     emoji: '💰', colour: 'bg-green-100 text-green-700 border-green-200' },
  information: { label: 'Information',  emoji: 'ℹ️', colour: 'bg-slate-100 text-slate-700 border-slate-200' },
  other      : { label: 'Other',        emoji: '🤝', colour: 'bg-purple-100 text-purple-700 border-purple-200' },
};

// Labels and colours for responder status
export const RESPONDER_STATUS_META: Record<
  ResponderStatus,
  { label: string; colour: string }
> = {
  offered  : { label: 'Offered',   colour: 'bg-blue-50 text-blue-700 border-blue-200'    },
  en_route : { label: 'En Route',  colour: 'bg-amber-50 text-amber-700 border-amber-200' },
  arrived  : { label: 'Arrived',   colour: 'bg-green-50 text-green-700 border-green-200' },
  completed: { label: 'Completed', colour: 'bg-slate-100 text-slate-500 border-slate-200' },
};
