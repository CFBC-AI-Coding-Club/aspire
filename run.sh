#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Function to cleanup background processes on exit
cleanup() {
    print_warning "Shutting down all services..."
    kill 0
    exit
}

trap cleanup SIGINT SIGTERM

# Get the directory where the script is located
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

print_info "Starting all Aspire services..."
echo ""

# Array to track PIDs
declare -a PIDS

# Start Backend (Bun)
print_info "Starting Backend (Port: default)..."
cd "$SCRIPT_DIR/backend"
if [ ! -d "node_modules" ]; then
    print_warning "Backend dependencies not found. Installing..."
    bun install
fi
bun run dev > >(sed "s/^/$(echo -e ${CYAN})[BACKEND]$(echo -e ${NC}) /") 2>&1 &
BACKEND_PID=$!
PIDS+=($BACKEND_PID)
print_success "Backend started (PID: $BACKEND_PID)"
echo ""

# Start Frontend (Vite)
print_info "Starting Frontend (Port: 3001)..."
cd "$SCRIPT_DIR/frontend"
if [ ! -d "node_modules" ]; then
    print_warning "Frontend dependencies not found. Installing..."
    bun install
fi
bun run dev > >(sed "s/^/$(echo -e ${MAGENTA})[FRONTEND]$(echo -e ${NC}) /") 2>&1 &
FRONTEND_PID=$!
PIDS+=($FRONTEND_PID)
print_success "Frontend started (PID: $FRONTEND_PID)"
echo ""

# Start AI Service (Python)
print_info "Starting AI Service..."
cd "$SCRIPT_DIR/ai"
if [ ! -d "venv" ] && [ ! -d ".venv" ]; then
    print_warning "Python virtual environment not found. Creating one..."
    python3 -m venv venv
    source venv/bin/activate
    print_info "Installing Python dependencies..."
    pip install openai python-dotenv requests
else
    if [ -d "venv" ]; then
        source venv/bin/activate
    else
        source .venv/bin/activate
    fi
fi
python main.py > >(sed "s/^/$(echo -e ${YELLOW})[AI]$(echo -e ${NC}) /") 2>&1 &
AI_PID=$!
PIDS+=($AI_PID)
print_success "AI Service started (PID: $AI_PID)"
echo ""

print_success "All services started successfully!"
echo ""
print_info "Services running:"
echo -e "  ${MAGENTA}Frontend:${NC} http://localhost:3001"
echo -e "  ${CYAN}Backend:${NC}  Check backend logs for port"
echo -e "  ${YELLOW}AI Service:${NC} Running"
echo ""
print_info "Press Ctrl+C to stop all services"
echo ""

# Wait for all background processes
wait
