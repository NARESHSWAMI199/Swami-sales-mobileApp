FROM node:20-slim

ARG HTTP_PROXY
ARG HTTPS_PROXY
ARG NO_PROXY

ENV HTTP_PROXY=${HTTP_PROXY}
ENV HTTPS_PROXY=${HTTPS_PROXY}
ENV NO_PROXY=${NO_PROXY}

# Install Yarn globally
# This ensures Yarn is available in the container
#RUN npm install -g yarn

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and yarn.lock first to leverage Docker cache
# This means if only your source code changes, these layers won't be rebuilt
COPY package.json yarn.lock ./

# Install project dependencies using Yarn
# 'yarn install --frozen-lockfile' is preferred over 'yarn install' in CI/CD environments
# for reproducible builds, similar to 'npm ci'.
RUN yarn install --frozen-lockfile

# Copy the rest of your application code
COPY . .

# Expose the port your React Native development server might run on
# Default for Metro Bundler is 8081
EXPOSE 8081

# Command to run your React Native application
# For development, you might want to start the Metro Bundler
CMD ["yarn", "start"]

# --- Optional: Additions for Native Builds (Android and/or iOS) ---

# --- For Android Builds ---
# This section would typically be added if you need to build Android APKs within the Docker container.
# It significantly increases image size.

# ENV ANDROID_SDK_ROOT=/usr/local/android-sdk
# ENV PATH=$PATH:$ANDROID_SDK_ROOT/cmdline-tools/latest/bin:$ANDROID_SDK_ROOT/platform-tools:$ANDROID_SDK_ROOT/build-tools/34.0.0 # Adjust build-tools version
#
# RUN apt-get update && apt-get install -y --no-install-recommends \
#     openjdk-17-jdk \
#     wget \
#     unzip \
#     && rm -rf /var/lib/apt/lists/*
#
# RUN mkdir -p $ANDROID_SDK_ROOT \
#     && wget -q https://dl.google.com/android/repository/commandlinetools-linux-8509380_latest.zip -O android-commandline-tools.zip \
#     && unzip -q android-commandline-tools.zip -d $ANDROID_SDK_ROOT/cmdline-tools \
#     && rm android-commandline-tools.zip \
#     && mv $ANDROID_SDK_ROOT/cmdline-tools/cmdline-tools $ANDROID_SDK_ROOT/cmdline-tools/latest
#
# RUN yes | sdkmanager --licenses
# RUN sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0" # Adjust API and build-tools versions
# RUN sdkmanager "system-images;android-34;google_apis;x86_64" # For emulator if needed

# --- For iOS Builds (Highly complex and often not done in Docker directly) ---
#