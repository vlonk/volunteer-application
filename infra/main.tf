resource "aws_s3_bucket" "kiwe-bucket"{
    bucket ="kiwe-bucket"

    tags ={
        project = "kiwe"
    }
}

resource "aws_s3_bucket_ownership_controls" "kiwe_bucket_ownership" {
  bucket = aws_s3_bucket.kiwe-bucket.bucket
  rule {
    object_ownership = "BucketOwnerPreferred"
  }
}

resource "aws_s3_bucket_public_access_block" "kiwe_bucket_public_access_block" {
  bucket = aws_s3_bucket.kiwe-bucket.id

  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_versioning" "kiwe_bucket_versioning" {
  bucket = aws_s3_bucket.kiwe-bucket.bucket

  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "example" {
  bucket = aws_s3_bucket.kiwe-bucket.bucket

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_cloudfront_origin_access_identity" "oai" {
    comment = "Origin Access Identity for kiwe S3 bucket"
}

resource "aws_s3_bucket_policy" "kiwe_bucket_policy" {
    bucket = aws_s3_bucket.kiwe-bucket.id

policy = jsonencode({
    Version = "2012-10-17"
    Id      = "CloudFrontKiwePolicy"
    Statement = [
      {
        Sid       = "AllowCloudFrontOAI"
        Effect    = "Allow"
        Principal = {
          AWS = aws_cloudfront_origin_access_identity.oai.iam_arn
        }
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.kiwe-bucket.arn}/*"
      }
    ]
  })
}

locals {
  s3_origin_id = "kiwe-s3-origin"
}

#####################################################################################


resource "aws_cloudfront_distribution" "kiwe_distribution" {
  origin {
    domain_name = aws_s3_bucket.kiwe-bucket.bucket_regional_domain_name
    origin_id   = local.s3_origin_id

    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.oai.cloudfront_access_identity_path
    }
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = local.s3_origin_id

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  custom_error_response {
    error_code         = 403
    response_code      = 200
    response_page_path = "/index.html"
  }

  custom_error_response {
    error_code         = 404
    response_code      = 200
    response_page_path = "/index.html"
  }

  price_class = "PriceClass_100"

  viewer_certificate {
    cloudfront_default_certificate = true
  }

  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["US", "CA"]
    }
  }

  tags = {
    project = "kiwe"
  }
}

# IAM Role for Lambda Execution
resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [{
      Action = "sts:AssumeRole",
      Effect = "Allow",
      Principal = {
        Service = "lambda.amazonaws.com"
      }
    }]
  })
}

# Attach IAM Role Policy for Lambda to write logs
resource "aws_iam_role_policy_attachment" "lambda_logs" {
  role       = aws_iam_role.lambda_exec_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

# Lambda Function for Express Backend
resource "aws_lambda_function" "express_backend" {
  function_name = "express-backend"
  handler       = "lambda.handler"
  runtime       = "nodejs18.x"
  role          = aws_iam_role.lambda_exec_role.arn

  filename         = "${path.module}/../backend/express.zip"
  source_code_hash = filebase64sha256("${path.module}/../backend/express.zip")
}

# API Gateway HTTP API
resource "aws_apigatewayv2_api" "http_api" {
  name          = "express-api"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://d381dee9723cth.cloudfront.net"]  # Replace with your frontend URL
    allow_methods = ["OPTIONS", "GET", "POST", "PUT", "DELETE"]
    allow_headers = ["Content-Type", "Authorization"]
    max_age       = 3600
  }
}

# API Gateway Lambda Integration
resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id             = aws_apigatewayv2_api.http_api.id
  integration_type   = "AWS_PROXY"
  integration_uri    = aws_lambda_function.express_backend.invoke_arn
  payload_format_version = "2.0"
}

# API Gateway Route (Proxy for All Methods)
resource "aws_apigatewayv2_route" "default_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "ANY /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# API Gateway Route for OPTIONS (Preflight Request)
resource "aws_apigatewayv2_route" "options_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "OPTIONS /{proxy+}"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# API Gateway Stage (Auto Deploy)
resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = "$default"
  auto_deploy = true
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "allow_api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.express_backend.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}
