import test from 'ava';
import sinon from 'sinon';
import { createMagicAdminSDK } from '../../../lib/factories';
import { API_KEY } from '../../../lib/constants';
import { createApiKeyMissingError, MagicAdminSDKError } from '../../../../src/core/sdk-exceptions';
import { get } from '../../../../src/utils/rest';

const successRes = Promise.resolve({
  wallet_type: 'ICON',
  public_address: 'mock_public_address',
});
const nullRes = Promise.resolve({});

test('#01: Successfully GETs to multi-blockchain metadata endpoint via issuer', async t => {
  const sdk = createMagicAdminSDK('https://example.magic.link');

  const getStub = sinon.stub();
  getStub.returns(successRes);
  (get as any) = getStub;

  const result = await sdk.users.getMultiBlockchainMetadataByIssuer('did:ethr:0x1234', 'ICON');

  const getArguments = getStub.args[0];

  t.deepEqual(getArguments, [
    'https://example.magic.link/v2/admin/auth/user/public/address/get',
    API_KEY,
    { wallet_type: 'ICON', issuer: 'did:ethr:0x1234' },
  ]);
  t.deepEqual(result, {
    walletType: 'ICON',
    publicAddress: 'mock_public_address',
  });
});

test('#02: Successfully GETs `null` multi-blockchain metadata endpoint via issuer', async t => {
  const sdk = createMagicAdminSDK('https://example.magic.link');

  const getStub = sinon.stub();
  getStub.returns(nullRes);
  (get as any) = getStub;

  const result = await sdk.users.getMultiBlockchainMetadataByIssuer('did:ethr:0x1234', 'ICON');

  const getArguments = getStub.args[0];
  t.deepEqual(getArguments, [
    'https://example.magic.link/v2/admin/auth/user/public/address/get',
    API_KEY,
    { issuer: 'did:ethr:0x1234', wallet_type: 'ICON' },
  ]);
  t.deepEqual(result, {
    walletType: null,
    publicAddress: null,
  });
});

test('#03: Fails GET multi-blockchain metadata if API key is missing', async t => {
  const sdk = createMagicAdminSDK('https://example.magic.link');
  (sdk as any).secretApiKey = undefined;

  const getStub = sinon.stub();
  (get as any) = getStub;

  const expectedError = createApiKeyMissingError();

  const error: MagicAdminSDKError = await t.throwsAsync(
    sdk.users.getMultiBlockchainMetadataByIssuer('did:ethr:0x1234', 'ICON'),
  );

  t.false(getStub.called);
  t.is(error.code, expectedError.code);
  t.is(error.message, expectedError.message);
});
