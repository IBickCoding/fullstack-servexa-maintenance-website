package edu.uscb.csci470sp26.servexa_backend.exception;

public class TenantNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 582237545785868420L;

	public TenantNotFoundException(Long id) {
		super("Could not find the user with id " + id);
	}
	
	// added for unit testing
	public TenantNotFoundException(String message) {
    super(message);
  }
}