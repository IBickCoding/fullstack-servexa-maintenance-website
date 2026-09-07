package edu.uscb.csci470sp26.servexa_backend.exception;

public class VendorNotFoundException extends RuntimeException {
	private static final long serialVersionUID = 582237545785868420L;

	public VendorNotFoundException(Long id) {
		super("Could not find the user with id " + id);
	}
	
	// added for unit testing
	public VendorNotFoundException(String message) {
    super(message);
  }
}