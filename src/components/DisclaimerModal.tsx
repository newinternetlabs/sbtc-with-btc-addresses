import React, { useState } from 'react';

interface DisclaimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ isOpen, onClose }) => {
  const [checkboxes, setCheckboxes] = useState({
    disclaimer: false,
    understanding1: false,
    understanding2: false,
    understanding3: false,
  });

  const allChecked = Object.values(checkboxes).every(Boolean);

  const handleCheckboxChange = (key: keyof typeof checkboxes) => {
    setCheckboxes((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-70">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Disclaimer</h2>
          
          <div className="space-y-4 mb-6">
            <div className="flex items-start">
              <input
                type="checkbox"
                id="disclaimer"
                checked={checkboxes.disclaimer}
                onChange={() => handleCheckboxChange('disclaimer')}
                className="mt-1 mr-2"
              />
              <label htmlFor="disclaimer" className="text-sm font-mono">
                THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="understanding1"
                checked={checkboxes.understanding1}
                onChange={() => handleCheckboxChange('understanding1')}
                className="mt-1 mr-2"
              />
              <label htmlFor="understanding1" className="text-sm">
                I understand entering a bitcoin address generated outside of this app will cause my sBTC to be lost 
                unless I have the private key and the technical knowledge to design and build a wallet to recover it.
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="understanding2"
                checked={checkboxes.understanding2}
                onChange={() => handleCheckboxChange('understanding2')}
                className="mt-1 mr-2"
              />
              <label htmlFor="understanding2" className="text-sm">
                Likewise, sending layer 1 bitcoin to an address generated in this app will cause my BTC to be lost 
                unless I have the private key and the technical knowledge to design and build a wallet to recover it.
              </label>
            </div>
            
            <div className="flex items-start">
              <input
                type="checkbox"
                id="understanding3"
                checked={checkboxes.understanding3}
                onChange={() => handleCheckboxChange('understanding3')}
                className="mt-1 mr-2"
              />
              <label htmlFor="understanding3" className="text-sm">
                Neither New Internet Labs Limited nor anyone else will provide assistance recovering lost sBTC, STX, BTC or other tokens.
              </label>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={onClose}
              disabled={!allChecked}
              className={`px-4 py-2 rounded font-medium ${
                allChecked
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              I Agree
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DisclaimerModal; 