const request = require('./Request');
const { Handler, ApiErrors, ModuleError } = require('./errors');
const hash = require('./Hash');

const trigger = async ({
  method = 'POST', path, credentials, payload,
}) => {
  let headers;
  let encryptedBVN;
  let bvnData;

  try {
    const { host } = credentials;
    const OrganisationCode = Buffer.from(credentials.organisationCode || '').toString('base64');

    if (credentials.aes_key && credentials.ivkey) {
      const {
        aesKey, ivkey, password, organisationCode,
      } = credentials;
      encryptedBVN = hash.encrypt(JSON.stringify(payload), aesKey, ivkey);
      bvnData = hash.BVNData(organisationCode, password);

      headers = {
        Authorization: bvnData.authHeader,
        SIGNATURE: bvnData.signatureHeader,
        SIGNATURE_METH: bvnData.signatureMethodHeader,
        Accept: 'application/json',
        'Content-Type': 'application/json',
      };
    }

    const options = {
      headers: {
        'Sandbox-Key': credentials.sandbox_key,
        OrganisationCode,
        ...headers,
      },
      body: encryptedBVN,
    };

    const response = await request.http({
      method,
      host,
      path,
      options,
    });
    if (response.statusCode !== 200) {
      return new ApiErrors(Handler.Api(response.statusCode));
    }
    if (response.body) {
      return JSON.parse(hash.decrypt(response.body, credentials.aes_key, credentials.ivkey));
    }

    return {
      password: response.headers.password,
      ivkey: response.headers.ivkey,
      aes_key: response.headers.aes_key,
    };
  } catch (error) {
    if (error.statusCode) {
      throw new ApiErrors(Handler.Api(error.statusCode));
    }
    throw new ModuleError(Handler.Module(error));
  }
};

exports.Reset = async (data) => {
  try {
    return await trigger({
      method: 'POST',
      path: '/nibss/bvnr/Reset',
      credentials: { ...data },
    });
  } catch (error) {
    return error;
  }
};

exports.VerifySingleBVN = async (data) => {
  try {
    const payload = { BVN: data.bvn };
    return await trigger({
      method: 'POST',
      path: '/nibss/bvnr/VerifySingleBVN',
      credentials: { ...data },
      payload,
    });
  } catch (error) {
    return error;
  }
};
