import CASAuthentication from 'cas-authentication';

const cas = new CASAuthentication({
    cas_url: process.env.CAS_URL,
    service_url: process.env.SERVICE_URL,
    cas_version: '2.0',
    is_dev_mode: process.env.CAS_DEV_MODE === 'false' ? false : true,
    dev_mode_user: 'cas.dev',
    session_name: 'cas_user',
    destroy_session: true, // USE TO kill session and CAS connection
});

export default cas;
