export interface MagicAdminSDKAdditionalConfiguration {
  endpoint?: string;
}

export interface MagicUserMetadata {
  issuer: string | null;
  publicAddress: string | null;
  email: string | null;
  oauthProvider: string | null;
  phoneNumber: string | null;
}

export interface MagicMultiBlockChainMetadata {
  walletType: string | null;
  publicAddress: string | null;
}
