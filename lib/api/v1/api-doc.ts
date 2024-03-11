
export default {
	openapi: "3.0.0",
	info: {
		title: "CloudTalk assignment",
		version: "1.0.0",
	},
	components: {
		parameters: {
			Page_Size:   {
				name:        'size',
				description: 'max number of results to return per page. Default: 10',
				in:          'query',
				schema:      {
					type:   'number',
					minimum: 10,
				},
			},
			Page_Number: {
				name:        'page',
				description: 'Which page of results to return. Pages are zero based.',
				in:          'query',
				schema:      {
					type: 'number',
					minimum: 0,
				},
			}
		},
		responses:  {
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
			Product_List:  {
				description: 'List of products',
				content:     {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								page_info: {
									$ref: '#/components/schemas/Page_Info',
								},
								products: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Product_Response',
									},
								},
							},
						},
					},
				},
			},
		},
		schemas:    {
			Page_Info:        {
				type:        'object',
				description: 'paging',
				required:    [ 'size', 'pages' ],
				properties:  {
					size:     {
						type:        'number',
						description: 'Page size',
					},
					pages:    {
						type:        'number',
						description: 'Number of available pages using this page size',
					},
					next:     {
						type:        'number',
						description: 'If exists, number of next page',
						minimum:     1,
					},
					previous: {
						type:        'number',
						description: 'If exists, number of previous page (pages are zero based)',
						minimum:     0,
					},
				},
			},
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
