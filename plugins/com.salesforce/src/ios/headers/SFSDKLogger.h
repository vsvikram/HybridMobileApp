/*
 SFSDKLogger.h
 SalesforceAnalytics
 
 Created by Bharath Hariharan on 6/8/17.
 
 Copyright (c) 2017-present, salesforce.com, inc. All rights reserved.
 
 Redistribution and use of this software in source and binary forms, with or without modification,
 are permitted provided that the following conditions are met:
 * Redistributions of source code must retain the above copyright notice, this list of conditions
 and the following disclaimer.
 * Redistributions in binary form must reproduce the above copyright notice, this list of
 conditions and the following disclaimer in the documentation and/or other materials provided
 with the distribution.
 * Neither the name of salesforce.com, inc. nor the names of its contributors may be used to
 endorse or promote products derived from this software without specific prior written
 permission of salesforce.com, inc.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND
 FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR
 CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL
 DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
 WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY
 WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

#define DD_LEGACY_MACROS 0
#import "DDLog.h"
#import "SFSDKFileLogger.h"

@interface SFSDKLogger : NSObject

/**
 * Component name associated with this logger.
 */
@property (nonatomic, readonly, strong, nonnull) NSString *componentName;

/**
 * Instance of the underlying logger being used.
 */
@property (nonatomic, readonly, strong, nonnull) DDLog *logger;

/**
 * Instance of the underlying file logger being used.
 */
@property (nonatomic, readonly, strong, nonnull) SFSDKFileLogger *fileLogger;

/**
 * Used to get and set the current log level associated with this logger.
 */
@property (nonatomic, readwrite, assign, getter=getLogLevel) DDLogLevel logLevel;

/**
 * Used to disable or enable file logging.
 */
@property (nonatomic, readwrite, assign, getter=isFileLoggingEnabled) BOOL fileLoggingEnabled;

/**
 * Returns an instance of this class associated with the default component.
 *
 * @return Instance of this class.
 */
+ (nonnull instancetype)sharedDefaultInstance;

/**
 * Returns an instance of this class associated with the specified component.
 *
 * @param componentName Component name.
 * @return Instance of this class.
 */
+ (nonnull instancetype)sharedInstanceWithComponent:(nonnull NSString *)componentName;

/**
 * Resets and removes all components configured. Used only by tests.
 */
+ (void)flushAllComponents;

/**
 * Returns an array of components that have loggers initialized.
 *
 * @return Array of components.
 */
+ (nonnull NSArray<NSString *> *)allComponents;

/**
 * Logs an error log line.
 *
 * @param class Class.
 * @param message Log message.
 */
- (void)e:(nonnull Class)class message:(nonnull NSString *)message;

/**
 * Logs a warning log line.
 *
 * @param class Class.
 * @param message Log message.
 */
- (void)w:(nonnull Class)class message:(nonnull NSString *)message;

/**
 * Logs an info log line.
 *
 * @param class Class.
 * @param message Log message.
 */
- (void)i:(nonnull Class)class message:(nonnull NSString *)message;

/**
 * Logs a verbose log line.
 *
 * @param class Class.
 * @param message Log message.
 */
- (void)v:(nonnull Class)class message:(nonnull NSString *)message;

/**
 * Logs a debug log line.
 *
 * @param class Class.
 * @param message Log message.
 */
- (void)d:(nonnull Class)class message:(nonnull NSString *)message;

/**
 * Logs a log line of the specified level.
 *
 * @param class Class.
 * @param level Log level.
 * @param message Log message.
 */
- (void)log:(nonnull Class)class level:(DDLogLevel)level message:(nonnull NSString *)message;

/**
 * Logs a log line of the specified level.
 *
 * @param class Class.
 * @level Log level.
 * @param format The format message, and optional arguments to expand in the format.
 * @param ... The arguments to the message format string.
 */
- (void)log:(nonnull Class)class level:(DDLogLevel)level format:(nonnull NSString *)format, ...;

@end
