
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
			},
			Product_ID:  {
				name:        'product_id',
				description: 'ID of product to delete',
				in:          'path',
				schema:      {
					type:   'string',
					format: 'uuid',
				},
			},
			Review_ID:   {
				name:        'review_id',
				description: 'ID of review',
				in:          'path',
				schema:      {
					type:   'string',
					format: 'uuid',
				},
			},
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
			Review:       {
				description: 'Single review',
				content:     {
					'application/json': {
						schema: {
							$ref: '#/components/schemas/Review_Response',
						},
					},
				},
			},
			Review_List:  {
				description: 'List of reviews',
				content:     {
					'application/json': {
						schema: {
							type: 'object',
							properties: {
								page_info: {
									$ref: '#/components/schemas/Page_Info',
								},
								reviews: {
									type: 'array',
									items: {
										$ref: '#/components/schemas/Review_Response',
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
			Product_Update:   {
				type:        'object',
				description: 'Data of new product',
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
			Review_Create:    {
				type:        'object',
				description: 'Data of new review',
				required:    [ 'first_name', 'last_name', 'rating' ],
				properties:  {
					first_name: {
						type: 'string',
						description: 'First name of reviewer',
					},
					last_name:  {
						type: 'string',
						description: 'Last name of reviewer',
					},
					comment:    {
						type:        'string',
						description: 'Review text',
					},
					rating:     {
						type: 'number',
						enum: [ 0, 1, 2, 3, 4, 5 ],
					},
				},
			},
			Review_Response:  {
				type:        'object',
				description: 'Data of new review',
				required:    [ 'review_id', 'product_id', 'first_name', 'last_name', 'rating' ],
				properties:  {
					review_id: {
						type:        'string',
						description: 'ID of this review',
						format:      'uuid',
					},
					product_id: {
						type:        'string',
						description: 'ID of product this review is for',
						format:      'uuid',
					},
					first_name: {
						type: 'string',
						description: 'First name of reviewer',
					},
					last_name:  {
						type: 'string',
						description: 'Last name of reviewer',
					},
					comment:    {
						type:        'string',
						description: 'Review text',
					},
					rating:     {
						type: 'number',
						enum: [ 0, 1, 2, 3, 4, 5 ],
					},
				},
			},
			Review_Update:    {
				type:        'object',
				description: 'Data of new review',
				properties:  {
					first_name: {
						type: 'string',
						description: 'First name of reviewer',
					},
					last_name:  {
						type: 'string',
						description: 'Last name of reviewer',
					},
					comment:    {
						type:        'string',
						description: 'Review text',
					},
					rating:     {
						type: 'number',
						enum: [ 0, 1, 2, 3, 4, 5 ],
					},
				},
			},
		},
	},
	paths: {
	},
};
