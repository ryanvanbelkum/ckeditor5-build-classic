import Plugin from '@ckeditor/ckeditor5-core/src/plugin';
import FileRepository from '@ckeditor/ckeditor5-upload/src/filerepository';
import { attachLinkToDocumentation } from '@ckeditor/ckeditor5-utils/src/ckeditorerror';

export default class FirebaseUploadAdapter extends Plugin {
	static get requires() {
		return [ FileRepository ];
	}

	static get pluginName() {
		return 'FirebaseUploadAdapter';
	}

	init() {
		const options = this.editor.config.get( 'firebaseUpload' );

		if ( !options ) {
			return;
		}

		if ( !options.storageObj ) {
			console.warn( attachLinkToDocumentation(
				'firebase-upload-adapter-missing-storage-object: Missing the "storageObj" property in the "firebaseUpload" editor configuration.'
			) );

			return;
		}

		this.editor.plugins.get( FileRepository ).createUploadAdapter = loader => {
			return new Adapter( loader, options );
		};
	}
}

class Adapter {
	constructor( loader, options ) {
		this.loader = loader;
		this.options = options;
	}

	upload() {
		return this.loader.file
			.then( file => new Promise( ( resolve, reject ) => {
				this._initRequest( file )
					.then( res => resolve( res ) )
					.catch( err => reject( err ) );
			} ) );
	}

	/**
	 * Aborts the upload process.
	 *
	 * @see module:upload/filerepository~UploadAdapter#abort
	 * @returns {Promise}
	 */
	abort() {
		console.log( 'abort image upload' );
	}

	_initRequest( file ) {
		return this.options.storageObj.uploadEditorImage( file );
	}
}
