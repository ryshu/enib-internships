// Type definitions for cas-authentication
// Project: CAS Authentication
// Definitions by: Oscar Marie--Taillefer <o5mariet@enib.fr>

/*~ This declaration specifies that the function
 *~ is the exported object from the file
 */
declare module 'cas-authentication' {
    import { Request, Response, NextFunction } from 'express';

    class CASAuthentication {
        public bounce(req: Request, res: Response, next: NextFunction): void;
        public block(req: Request, res: Response, next: NextFunction): void;
        public bounce_redirect(req: Request, res: Response, next: NextFunction): void;
        public logout(req: Request, res: Response, next: NextFunction): void;

        public constructor(opts: CASOpts);
    }

    interface CASOpts {
        cas_url: string;
        service_url: string;
        cas_version?: '1.0' | '2.0' | '3.0' | 'saml1.1';
        renew?: boolean;
        is_dev_mode?: boolean;
        dev_mode_user?: string;
        dev_mode_info?: any;
        session_name?: string;
        session_info?: string | false;
        destroy_session?: boolean;
    }

    export = CASAuthentication;
}
