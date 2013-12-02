/** Functions for working with FileSystem API **/

/* On initialize file system */
function onInitFs(fs) {
	fileSystem = fs;
	console.log("Sucessfully requested 5MB of persistent file storage; file system: " + fs.name);
	
	// create or get a file and write to it
	// four inputs: file name, options, function, and error callback
	// OPTIONS:
	// create: true = creates if doesn't exist, throws error if does
	// 		   false = simply fetch and return
	// exclusive: true = returns error if file already exists with create:true
	fileSystem.root.getFile(
		'test.txt', 		
		{create: false}, 	
		function(fileEntry) { write(fileEntry, 'Testing'); 	}, 
		errorHandler
	);

	// read from file
	// four inputs: file name, options, function, and error callback
	// throws error of file doesn't exist
	fileSystem.root.getFile(
		'test.txt', 
		{}, 
		function(fileEntry) { read(fileEntry); }, 
		errorHandler
	);
}

/* Error handler function */
function errorHandler(e) {
  var msg = '';

  switch (e.code) {
	case FileError.QUOTA_EXCEEDED_ERR:
	  msg = 'QUOTA_EXCEEDED_ERR';
	  break;
	case FileError.NOT_FOUND_ERR:
	  msg = 'NOT_FOUND_ERR';
	  break;
	case FileError.SECURITY_ERR:
	  msg = 'SECURITY_ERR';
	  break;
	case FileError.INVALID_MODIFICATION_ERR:
	  msg = 'INVALID_MODIFICATION_ERR';
	  break;
	case FileError.INVALID_STATE_ERR:
	  msg = 'INVALID_STATE_ERR';
	  break;
	default:
	  msg = 'Unknown Error';
	  break;
  };

  console.log('Error: ' + msg);
  console.log(e);
}

/* Write text to file entry */
function write(fileEntry, textToWrite) {
	// Create a FileWriter object for FileEntry
	fileEntry.createWriter(function(fileWriter) {
	  
		fileWriter.onwriteend = function(e) {
			console.log('Write completed.');
		};

		fileWriter.onerror = function(e) {
			console.log('Write failed: ' + e.toString());
		};

		// Create a new Blob and write it to file
		var blob = new Blob([textToWrite], {type: 'text/plain'}); 

		fileWriter.write(blob);

	}, errorHandler);
}

/* Append text to file entry */
function append(fileEntry, textToWrite) {
	// Create a FileWriter object for FileEntry
	fileEntry.createWriter(function(fileWriter) {
		// start write position at EOF
		fileWriter.seek(fileWriter.length);
	  
		fileWriter.onwriteend = function(e) {
			console.log('Write completed.');
		};

		fileWriter.onerror = function(e) {
			console.log('Write failed: ' + e.toString());
		};

		// Create a new Blob and write it to file
		var blob = new Blob([textToWrite], {type: 'text/plain'}); 

		fileWriter.write(blob);

	}, errorHandler);
}

/* Read from a file */
function read(fileEntry) {
	// Get a File object representing the file,
	// then use FileReader to read its contents.
	fileEntry.file(function(file) {
		var reader = new FileReader();

		reader.onloadend = function(e) {
			var txtArea = document.createElement('textarea');
			txtArea.value = this.result;
			document.body.appendChild(txtArea);
		};

		reader.readAsText(file);
	}, errorHandler);
}