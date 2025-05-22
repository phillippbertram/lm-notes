# Use Python 3.11 slim image
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install uv and create virtual environment
RUN pip install --no-cache-dir uv && \
    uv venv /app/.venv

# Activate virtual environment
ENV PATH="/app/.venv/bin:$PATH"

# Install Python dependencies
COPY pyproject.toml .
RUN uv pip install --no-cache-dir -e .

# Copy application code and env file
COPY . .
COPY .env .env

# Create non-root user
RUN useradd -m -u 1000 appuser && \
    chown -R appuser:appuser /app
USER appuser

# Expose port
EXPOSE 8000

# Run the application
CMD ["uv", "run", "fastapi", "dev", "--host", "0.0.0.0", "app/main.py"]
