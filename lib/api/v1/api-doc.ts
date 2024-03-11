
export default {
	openapi: "3.0.0",
	info: {
		title: "CloudTalk assignment",
		version: "1.0.0",
	},
	components: {
		responses: {
			Bad_Request:   {
				description: 'Something went terribly wrong',
				content: {
					"application/json": {
						schema: {
							type: "object",
							additionalProperties: true,
						},
					},
				},
			},
			Generic_Error: {
				description: 'Generic error',
				content: {
					"application/json": {
						schema: {
							type: "object",
							additionalProperties: true,
						},
					},
				},
			},
			Product:       {
				description: 'Single product',
				content:     {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Product_Response',
						},
					},
				},
			},
		},
		schemas: {
			Product_Create:   {
				type:        'object',
				description: 'Data of new product',
				required:    [ 'name', 'price' ],
				properties:  {
					name:        {
						type:        'string',
						description: 'Name of new product',
						minLength:   3,
					},
					description: {
						description: 'Description of new product',
						type: 'string',
					},
					price:       {
						type:             'number',
						// exclusiveMinumum: 0,
					},
				},
			},
			Product_Response: {
				type:        'object',
				description: 'Product data',
				required:    ['public_id', 'name', 'price' ],
				properties:  {
					public_id:   { type: 'string' },
					name:        { type: 'string' },
					description: { type: 'string' },
					price:       {
						type:             'number',
						// exclusiveMinumum: 0,
					},
				},
			},
		},
	},
	paths: {
	},
};
