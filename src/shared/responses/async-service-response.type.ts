interface ServiceResponse<S, P = undefined> {
  status: 'success' | 'error' | S;
  payload?: P;
}

export type AsyncServiceResponse<S, P> = Promise<ServiceResponse<S, P>>;
