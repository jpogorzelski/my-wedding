package io.pogorzelski.mywedding.web.rest.errors;

import org.zalando.problem.AbstractThrowableProblem;
import org.zalando.problem.Status;

public class CustomerAccessDeniedException extends AbstractThrowableProblem {

    private static final long serialVersionUID = 1L;

    public CustomerAccessDeniedException() {
        super(ErrorConstants.FORBIDDEN_TYPE, "Customer doesn't have access to this operation", Status.FORBIDDEN);
    }
}
