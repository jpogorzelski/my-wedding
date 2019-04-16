package io.pogorzelski.mywedding.security;

/**
 * Constants for Spring Security authorities.
 */
public final class AuthoritiesConstants {

    public static final String ADMIN = "ROLE_ADMIN";

    public static final String USER = "ROLE_USER";

    public static final String ANONYMOUS = "ROLE_ANONYMOUS";

    public static final String CUSTOMER = "ROLE_CUSTOMER";

    public static final String COMPANY_OWNER = "ROLE_COMPANY_OWNER";

    public static final String COMPANY_WORKER = "ROLE_COMPANY_WORKER";

    private AuthoritiesConstants() {
    }
}
