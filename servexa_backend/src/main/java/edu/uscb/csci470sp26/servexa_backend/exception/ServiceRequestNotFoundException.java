package edu.uscb.csci470sp26.servexa_backend.exception;

public class ServiceRequestNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 582237545785868420L;

	public ServiceRequestNotFoundException(Long id) {
		super("Could not find the user with id " + id);
	}
	
	// added for unit testing
	public ServiceRequestNotFoundException(String message) {
    super(message);
  }
}